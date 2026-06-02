"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { TerminalLine } from "@/components/TerminalBlock";
import { cn } from "@/lib/utils";
import { COMMAND_NAMES, PAGE_TARGETS, commands, type CommandContext } from "./terminal-commands";

interface Entry {
  id: number;
  command: string;
  output: ReactNode;
}

export interface InteractiveTerminalProps {
  className?: string;
  children?: ReactNode;
}

export function InteractiveTerminal({ className, children }: InteractiveTerminalProps) {
  const router = useRouter();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [cleared, setCleared] = useState(false);
  const [glitching, setGlitching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const draftRef = useRef("");
  const idRef = useRef(0);

  const append = (command: string, output: ReactNode) => {
    idRef.current += 1;
    const entry: Entry = { id: idRef.current, command, output };
    setEntries((prev) => [...prev, entry]);
  };

  const execute = (raw: string) => {
    const trimmed = raw.trim();
    historyIndexRef.current = -1;
    draftRef.current = "";

    if (!trimmed) {
      append("", null);
      return;
    }

    historyRef.current.push(trimmed);

    if (trimmed === "clear") {
      setEntries([]);
      setCleared(true);
      return;
    }

    const spaceIndex = trimmed.indexOf(" ");
    const name = (spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex)).toLowerCase();
    const args = spaceIndex === -1 ? "" : trimmed.slice(spaceIndex + 1).trim();

    const command = commands[name];
    if (!command) {
      append(
        trimmed,
        <p className="text-muted-foreground">{`command not found: ${name} — try 'help'`}</p>,
      );
      return;
    }

    const ctx: CommandContext = {
      navigate: (href) => router.push(href),
      glitch: () => setGlitching(true),
      getHistory: () => [...historyRef.current],
    };

    let output: ReactNode;
    try {
      output = command.run(args, ctx);
    } catch {
      output = <p className="text-muted-foreground">error: something went wrong</p>;
    }
    append(trimmed, output);
  };

  const applyCompletion = (
    prefix: string,
    candidates: string[],
    build: (match: string) => string,
  ) => {
    const matches = candidates.filter((candidate) => candidate.startsWith(prefix));
    if (matches.length === 1 && matches[0]) {
      setInput(build(matches[0]));
    } else if (matches.length > 1) {
      append(input, <p className="text-muted-foreground">{matches.join("  ")}</p>);
    }
  };

  const complete = () => {
    const spaceIndex = input.indexOf(" ");

    if (spaceIndex === -1) {
      applyCompletion(input, COMMAND_NAMES, (match) => `${match} `);
      return;
    }

    const name = input.slice(0, spaceIndex);
    const arg = input.slice(spaceIndex + 1).trimStart();
    if (name === "cd" || name === "open") {
      applyCompletion(arg, PAGE_TARGETS, (match) => `${name} ${match}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      execute(input);
      setInput("");
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      complete();
      return;
    }

    if (event.key === "ArrowUp") {
      const history = historyRef.current;
      if (history.length === 0) return;
      event.preventDefault();
      if (historyIndexRef.current === -1) {
        draftRef.current = input;
        historyIndexRef.current = history.length - 1;
      } else if (historyIndexRef.current > 0) {
        historyIndexRef.current -= 1;
      }
      setInput(history[historyIndexRef.current] ?? "");
      return;
    }

    if (event.key === "ArrowDown") {
      if (historyIndexRef.current === -1) return;
      event.preventDefault();
      const history = historyRef.current;
      if (historyIndexRef.current < history.length - 1) {
        historyIndexRef.current += 1;
        setInput(history[historyIndexRef.current] ?? "");
      } else {
        historyIndexRef.current = -1;
        setInput(draftRef.current);
      }
    }
  };

  const handleBlockClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.getSelection()?.toString()) return;
    if (event.target instanceof HTMLElement && event.target.closest("a, button, input")) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div
      className={cn("flex flex-col gap-3", glitching && "terminal-glitch", className)}
      onClick={handleBlockClick}
      onAnimationEnd={() => setGlitching(false)}
    >
      {cleared ? null : children}

      <div aria-live="polite" className="flex flex-col gap-3">
        {entries.map((entry) =>
          entry.command ? (
            <TerminalLine key={entry.id} command={entry.command}>
              {entry.output}
            </TerminalLine>
          ) : (
            <p key={entry.id}>
              <span aria-hidden className="text-accent mr-2 select-none">
                ❯
              </span>
            </p>
          ),
        )}
      </div>

      <label className="flex cursor-text items-center">
        <span aria-hidden className="text-accent mr-2 select-none">
          ❯
        </span>
        <input
          ref={inputRef}
          value={input}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          aria-label="terminal input — type 'help' for commands"
          className="text-foreground max-w-full bg-transparent p-0 caret-transparent"
          style={{ width: `${input.length}ch` }}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span aria-hidden className="cursor-blink select-none">
          _
        </span>
      </label>
    </div>
  );
}
