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

export function ViewTransitionLink({ href, onClick, children, ...rest }: ViewTransitionLinkProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (isModifiedClick(event)) return;
      if (typeof document.startViewTransition !== "function") return;
      event.preventDefault();
      document.startViewTransition(() => {
        router.push(href);
      });
    },
    [href, onClick, router],
  );

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
