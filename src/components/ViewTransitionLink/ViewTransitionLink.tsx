"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, type AnchorHTMLAttributes, type MouseEvent } from "react";

type AnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export interface ViewTransitionLinkProps extends LinkProps, AnchorProps {
  href: string;
  children: React.ReactNode;
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

// Wait until the router commits + the browser paints the new tree.
// Two rAFs give React/Next a chance to render before we let
// startViewTransition capture the "after" snapshot.
function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function ViewTransitionLink({ href, onClick, children, ...rest }: ViewTransitionLinkProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (isModifiedClick(event)) return;
      if (typeof document.startViewTransition !== "function") return;
      event.preventDefault();
      document.startViewTransition(async () => {
        router.push(href);
        await waitForNextFrame();
      });
    },
    [href, onClick, router],
  );

  return (
    <Link href={href} onClick={handleClick} prefetch {...rest}>
      {children}
    </Link>
  );
}
