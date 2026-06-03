"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { TerminalCaret, TerminalLine } from "@/components/TerminalBlock";
import { cn } from "@/lib/utils";
import {
  COMMAND_NAMES,
  HIDDEN_FILES,
  PAGE_TARGETS,
  commands,
  type CommandContext,
} from "./commands";

interface Entry {
  id: number;
  command: string;
  output: ReactNode;
}

interface CompletionSession {
  matches: string[];
  index: number;
  build: (match: string) => string;
}

const session = {
  introPlayed: false,
  cleared: false,
  nextId: 0,
  entries: [] as Entry[],
  history: [] as string[],
};

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

  const [entries, setEntries] = useState<Entry[]>(() => session.entries);
  const [input, setInput] = useState("");
  const [cleared, setCleared] = useState(() => session.cleared);
  const [glitching, setGlitching] = useState(false);
  const [focused, setFocused] = useState(false);
  const [intro, setIntro] = useState(false);
  const [revealStatic, setRevealStatic] = useState(
    () => !introCommands || introCommands.length === 0,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const completionRef = useRef<CompletionSession | null>(null);
  const historyRef = useRef(session.history);
  const historyIndexRef = useRef(-1);
  const draftRef = useRef("");
  const introRef = useRef(false);
  const introCancelledRef = useRef(false);

  const append = (command: string, output: ReactNode) => {
    session.nextId += 1;
    const entry: Entry = { id: session.nextId, command, output };
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

  const complete = (): boolean => {
    const active = completionRef.current;
    if (active) {
      active.index = (active.index + 1) % active.matches.length;
      const match = active.matches[active.index];
      if (match) setInput(active.build(match));
      return true;
    }

    const spaceIndex = input.indexOf(" ");
    let prefix: string;
    let candidates: string[];
    let build: (match: string) => string;

    if (spaceIndex === -1) {
      if (!input) return false;
      prefix = input;
      candidates = COMMAND_NAMES;
      build = (match) => `${match} `;
    } else {
      const name = input.slice(0, spaceIndex);
      prefix = input.slice(spaceIndex + 1).trimStart();
      if (name === "cd" || name === "open") {
        candidates = PAGE_TARGETS;
      } else if (name === "cat") {
        candidates = HIDDEN_FILES;
      } else {
        return false;
      }
      build = (match) => `${name} ${match}`;
    }

    const matches = candidates.filter((candidate) => candidate.startsWith(prefix));
    if (matches.length === 0) return false;

    const first = matches[0];
    if (matches.length === 1 && first) {
      setInput(build(first));
      return true;
    }

    append(input, <p className="text-muted-foreground">{matches.join("  ")}</p>);
    completionRef.current = { matches, index: 0, build };
    if (first) setInput(build(first));
    return true;
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
      completionRef.current = null;
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
      completionRef.current = null;
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
      completionRef.current = null;
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
    session.entries = entries;
  }, [entries]);

  useEffect(() => {
    session.cleared = cleared;
  }, [cleared]);

  useEffect(() => {
    if (!introCommands || introCommands.length === 0) return;
    if (session.introPlayed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
      session.introPlayed = true;
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
          onChange={(event) => {
            completionRef.current = null;
            setInput(event.target.value);
          }}
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
