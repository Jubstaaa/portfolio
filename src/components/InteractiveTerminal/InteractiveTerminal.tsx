"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { TerminalCaret, TerminalLine } from "@/components/TerminalBlock";
import { cn } from "@/lib/utils";
import { commands, type CommandContext } from "./commands";
import {
  appendEntry,
  clearTerminal,
  getSessionState,
  pushHistory,
  useTerminalSession,
} from "./terminal-session";
import { useCommandHistory } from "./use-command-history";
import { useTabCompletion } from "./use-tab-completion";
import { useTerminalIntro } from "./use-terminal-intro";

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
  const { entries, history, cleared } = useTerminalSession();

  const [input, setInput] = useState("");
  const [glitching, setGlitching] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { handleArrowUp, handleArrowDown, resetHistoryNavigation } = useCommandHistory({
    input,
    setInput,
    history,
  });

  const execute = (raw: string) => {
    const trimmed = raw.trim();
    resetHistoryNavigation();

    if (!trimmed) {
      appendEntry("", null);
      return;
    }

    pushHistory(trimmed);

    const spaceIndex = trimmed.indexOf(" ");
    const name = (spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex)).toLowerCase();
    const args = spaceIndex === -1 ? "" : trimmed.slice(spaceIndex + 1).trim();

    if (name === "clear") {
      clearTerminal();
      return;
    }

    const command = commands[name];
    if (!command) {
      appendEntry(
        trimmed,
        <p className="text-muted-foreground">{`command not found: ${name} — try 'help'`}</p>,
      );
      return;
    }

    const ctx: CommandContext = {
      navigate: (href) => router.push(href),
      glitch: () => setGlitching(true),
      getHistory: () => [...getSessionState().history],
    };

    let output: ReactNode;
    try {
      output = command.run(args, ctx);
    } catch {
      output = <p className="text-muted-foreground">error: something went wrong</p>;
    }
    appendEntry(trimmed, output);
  };

  const {
    status: introStatus,
    revealStatic,
    skipIntro,
  } = useTerminalIntro({ introCommands, execute, setInput });

  const { complete, resetCompletion } = useTabCompletion({
    input,
    setInput,
    append: appendEntry,
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (skipIntro()) return;
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      resetCompletion();
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
      if (handleArrowUp(event)) resetCompletion();
      return;
    }

    if (event.key === "ArrowDown") {
      if (handleArrowDown(event)) resetCompletion();
    }
  };

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (skipIntro()) return;
      if (window.getSelection()?.toString()) return;
      if (!(event.target instanceof HTMLElement)) return;
      if (!event.target.closest("#main")) return;
      if (event.target.closest("a, button, input, textarea, select, [role='button']")) return;
      inputRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [skipIntro]);

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
          readOnly={introStatus === "playing"}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          aria-label="terminal input — type 'help' for commands"
          className="text-foreground min-w-0 cursor-default bg-transparent p-0 caret-transparent outline-none"
          style={{ width: `${input.length}ch` }}
          onChange={(event) => {
            resetCompletion();
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
