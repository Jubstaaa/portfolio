import { socials } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <ul className={cn("flex flex-col gap-1.5 text-sm", className)}>
      {socials.map((social) => (
        <li key={social.href}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted-foreground hover:text-foreground transition-token group inline-flex items-center gap-2"
          >
            <span aria-hidden className="text-muted-foreground group-hover:text-accent select-none">
              →
            </span>
            <span className="text-foreground lowercase">{social.label}</span>
            <span aria-hidden className="select-none">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
