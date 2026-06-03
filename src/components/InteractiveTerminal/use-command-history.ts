import { useCallback, useRef, type KeyboardEvent } from "react";

interface UseCommandHistoryOptions {
  input: string;
  setInput: (value: string) => void;
  history: string[];
}

export function useCommandHistory({ input, setInput, history }: UseCommandHistoryOptions) {
  const indexRef = useRef(-1);
  const draftRef = useRef("");

  const resetHistoryNavigation = useCallback(() => {
    indexRef.current = -1;
    draftRef.current = "";
  }, []);

  const handleArrowUp = (event: KeyboardEvent<HTMLInputElement>): boolean => {
    if (history.length === 0) return false;
    event.preventDefault();
    if (indexRef.current === -1) {
      draftRef.current = input;
      indexRef.current = history.length - 1;
    } else if (indexRef.current > 0) {
      indexRef.current -= 1;
    }
    setInput(history[indexRef.current] ?? "");
    return true;
  };

  const handleArrowDown = (event: KeyboardEvent<HTMLInputElement>): boolean => {
    if (indexRef.current === -1) return false;
    event.preventDefault();
    if (indexRef.current < history.length - 1) {
      indexRef.current += 1;
      setInput(history[indexRef.current] ?? "");
    } else {
      indexRef.current = -1;
      setInput(draftRef.current);
    }
    return true;
  };

  return { handleArrowUp, handleArrowDown, resetHistoryNavigation };
}
