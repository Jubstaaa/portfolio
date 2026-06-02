"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { TerminalCaret, TerminalLine } from "@/components/TerminalBlock";
import { cn } from "@/lib/utils";
import { COMMAND_NAMES, PAGE_TARGETS, commands, type CommandContext } from "./terminal-commands";

interface Entry {
  id: number;
  command: string;
  output: ReactNode;
}

export interface InteractiveTerminalProps {
  introCommands?: string[];
  className?: string;
  children?: ReactNode;
}

export function InteractiveTerminal({
  introCommands,
  className,
  children,
}: InteractiveTerminalProps) {
  const router = useRouter();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [cleared, setCleared] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [focused, setFocused] = useState(false);
  const [intro, setIntro] = useState(false);
  const [revealStatic, setRevealStatic] = useState(
    () => !introCommands || introCommands.length === 0,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const draftRef = useRef("");
  const idRef = useRef(0);
  const introRef = useRef(false);
  const introCancelledRef = useRef(false);

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

    const spaceIndex = trimmed.indexOf(" ");
    const name = (spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex)).toLowerCase();
    const args = spaceIndex === -1 ? "" : trimmed.slice(spaceIndex + 1).trim();

    if (name === "clear") {
      setEntries([]);
      setCleared(true);
      return;
    }

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
  ): boolean => {
    if (!prefix) return false;
    const matches = candidates.filter((candidate) => candidate.startsWith(prefix));
    if (matches.length === 1 && matches[0]) {
      setInput(build(matches[0]));
      return true;
    }
    if (matches.length > 1) {
      append(input, <p className="text-muted-foreground">{matches.join("  ")}</p>);
      return true;
    }
    return false;
  };

  const complete = (): boolean => {
    const spaceIndex = input.indexOf(" ");

    if (spaceIndex === -1) {
      return applyCompletion(input, COMMAND_NAMES, (match) => `${match} `);
    }

    const name = input.slice(0, spaceIndex);
    const arg = input.slice(spaceIndex + 1).trimStart();
    if (name === "cd" || name === "open") {
      return applyCompletion(arg, PAGE_TARGETS, (match) => `${name} ${match}`);
    }
    return false;
  };

  const skipIntro = () => {
    if (introRef.current) introCancelledRef.current = true;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (introRef.current) {
      skipIntro();
      return;
    }
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      execute(input);
      setInput("");
      return;
    }

    if (event.key === "Tab" && !event.shiftKey) {
      if (complete()) {
        event.preventDefault();
      }
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

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (introRef.current) {
        introCancelledRef.current = true;
        return;
      }
      if (window.getSelection()?.toString()) return;
      if (!(event.target instanceof HTMLElement)) return;
      if (!event.target.closest("#main")) return;
      if (event.target.closest("a, button, input, textarea, select, [role='button']")) return;
      inputRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  useEffect(() => {
    if (!introCommands || introCommands.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setRevealStatic(true));
      return;
    }

    introRef.current = true;
    introCancelledRef.current = false;
    let unmounted = false;

    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    const finish = (remaining: string[]) => {
      introRef.current = false;
      if (unmounted) return;
      for (const command of remaining) execute(command);
      setInput("");
      setIntro(false);
    };

    void (async () => {
      await sleep(0);
      if (unmounted) return;
      setIntro(true);
      setCleared(true);
      await sleep(400);

      const queue = [...introCommands];
      while (queue.length > 0) {
        const command = queue[0] ?? "";
        for (let index = 1; index <= command.length; index += 1) {
          if (introCancelledRef.current || unmounted) {
            finish(queue);
            return;
          }
          setInput(command.slice(0, index));
          await sleep(35 + Math.random() * 45);
        }
        if (introCancelledRef.current || unmounted) {
          finish(queue);
          return;
        }
        await sleep(200);
        execute(command);
        setInput("");
        queue.shift();
        await sleep(350);
      }
      introRef.current = false;
      setIntro(false);
    })();

    return () => {
      unmounted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inputRef.current?.scrollIntoView({ block: "nearest" });
  }, [entries]);

  return (
    <div
      className={cn("flex flex-col gap-3", glitching && "terminal-glitch", className)}
      onAnimationEnd={(event) => {
        if (event.animationName === "terminal-glitch") setGlitching(false);
      }}
    >
      {cleared ? null : (
        <div className={cn("flex flex-col gap-3", !revealStatic && "hidden")}>{children}</div>
      )}

      <div aria-live="polite" className="flex flex-col gap-3 empty:hidden">
        {entries.map((entry) => (
          <TerminalLine key={entry.id} command={entry.command}>
            {entry.output}
          </TerminalLine>
        ))}
      </div>

      <label className="flex cursor-default items-center">
        <TerminalCaret />
        <input
          ref={inputRef}
          id="terminal-input"
          name="terminal-input"
          value={input}
          readOnly={intro}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          aria-label="terminal input — type 'help' for commands"
          className="text-foreground min-w-0 cursor-default bg-transparent p-0 caret-transparent outline-none"
          style={{ width: `${input.length}ch` }}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <span
          aria-hidden
          className={cn("shrink-0 select-none", focused ? "cursor-blink" : "opacity-40")}
        >
          _
        </span>
      </label>
    </div>
  );
}
