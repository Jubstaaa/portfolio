import { useCallback, useEffect, useRef, useState } from "react";

import { getSessionState, markIntroPlayed, setCleared } from "./terminal-session";

export type IntroStatus = "idle" | "playing" | "done";

interface UseTerminalIntroOptions {
  introCommands: string[] | undefined;
  execute: (raw: string) => void;
  setInput: (value: string) => void;
}

export function useTerminalIntro({ introCommands, execute, setInput }: UseTerminalIntroOptions) {
  const [status, setStatus] = useState<IntroStatus>("idle");
  const [revealStatic, setRevealStatic] = useState(
    () => !introCommands || introCommands.length === 0,
  );

  const machineRef = useRef({ active: false, cancelled: false });
  const timeoutRef = useRef<number | null>(null);

  const skipIntro = useCallback((): boolean => {
    if (!machineRef.current.active) return false;
    machineRef.current.cancelled = true;
    return true;
  }, []);

  useEffect(() => {
    if (!introCommands || introCommands.length === 0) return;
    if (
      getSessionState().introPlayed ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      queueMicrotask(() => setRevealStatic(true));
      return;
    }

    machineRef.current = { active: true, cancelled: false };
    let unmounted = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutRef.current = window.setTimeout(resolve, ms);
      });

    const finish = (remaining: string[]) => {
      machineRef.current.active = false;
      if (unmounted) return;
      for (const command of remaining) execute(command);
      setInput("");
      setStatus("done");
    };

    void (async () => {
      await sleep(0);
      if (unmounted) return;
      setStatus("playing");
      markIntroPlayed();
      setCleared(true);
      await sleep(400);

      const queue = [...introCommands];
      while (queue.length > 0) {
        const command = queue[0] ?? "";
        for (let index = 1; index <= command.length; index += 1) {
          if (machineRef.current.cancelled || unmounted) {
            finish(queue);
            return;
          }
          setInput(command.slice(0, index));
          await sleep(35 + Math.random() * 45);
        }
        if (machineRef.current.cancelled || unmounted) {
          finish(queue);
          return;
        }
        await sleep(200);
        execute(command);
        setInput("");
        queue.shift();
        await sleep(350);
      }
      machineRef.current.active = false;
      setStatus("done");
    })();

    return () => {
      unmounted = true;
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
    // intentionally captures execute/setInput/introCommands from the first render. Caller must
    // keep execute referentially safe (close only over stable refs/store fns), never over render state.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only boot sequence;
  }, []);

  return { status, revealStatic, skipIntro };
}
