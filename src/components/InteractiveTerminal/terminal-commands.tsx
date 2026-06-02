import type { ReactNode } from "react";

import { NowPlaying } from "@/components/NowPlaying";
import { site } from "@/lib/content";
import { NavLinks } from "./NavLinks";

export interface CommandContext {
  navigate: (href: string) => void;
  glitch: () => void;
  getHistory: () => string[];
}

export interface TerminalCommand {
  description: string;
  hidden?: boolean;
  run: (args: string, ctx: CommandContext) => ReactNode;
}

const HOST = new URL(site.url).host;

const PAGES: Record<string, string> = {
  "~": "/",
  home: "/",
  ...Object.fromEntries(site.nav.map((item) => [item.label, item.href])),
};

export const PAGE_TARGETS = Object.keys(PAGES);

function resolvePage(arg: string): string | undefined {
  const key = arg.replace(/^\.?\//, "").replace(/\/$/, "") || "~";
  return PAGES[key];
}

function Line({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>;
}

function goTo(args: string, ctx: CommandContext): ReactNode {
  const href = resolvePage(args);
  if (!href) {
    return <Line>{`cd: no such file or directory: ${args}`}</Line>;
  }
  ctx.navigate(href);
  return null;
}

const VIM_ESCAPE = <Line>{"E37: no write since last change — just kidding, you're free."}</Line>;

export const commands: Record<string, TerminalCommand> = {
  help: {
    description: "list available commands",
    run: () => (
      <div className="space-y-0.5">
        {Object.entries(commands)
          .filter(([, command]) => !command.hidden)
          .map(([name, command]) => (
            <p key={name}>
              <span className="text-foreground inline-block w-[14ch]">{name}</span>
              <span className="text-muted-foreground">{command.description}</span>
            </p>
          ))}
      </div>
    ),
  },
  ls: {
    description: "list pages",
    run: () => <NavLinks />,
  },
  cd: {
    description: "go to a page — cd blog",
    run: goTo,
  },
  open: {
    description: "alias for cd",
    run: goTo,
  },
  whoami: {
    description: "who is this guy",
    run: () => (
      <>
        <p>{site.name}</p>
        <p className="text-muted-foreground">
          {site.role} · {site.location}
        </p>
      </>
    ),
  },
  "now-playing": {
    description: "what's on spotify right now",
    run: () => <NowPlaying />,
  },
  pwd: {
    description: "print working directory",
    run: () => <p>{`~/${site.handle}`}</p>,
  },
  echo: {
    description: "echo <text>",
    run: (args) => <p>{args}</p>,
  },
  history: {
    description: "commands typed this session",
    run: (_args, ctx) => (
      <div className="space-y-0.5">
        {ctx.getHistory().map((entry, index) => (
          <p key={index}>
            <span className="text-muted-foreground inline-block w-[5ch]">{index + 1}</span>
            {entry}
          </p>
        ))}
      </div>
    ),
  },
  clear: {
    description: "clear the terminal",
    run: () => null,
  },
  sudo: {
    description: "",
    hidden: true,
    run: () => <Line>{"nice try. you're not root here."}</Line>,
  },
  rm: {
    description: "",
    hidden: true,
    run: (args, ctx) => {
      if (args.startsWith("-rf")) {
        ctx.glitch();
        return <Line>{"site deleted. just kidding."}</Line>;
      }
      return <Line>{"rm: permission denied"}</Line>;
    },
  },
  vim: {
    description: "",
    hidden: true,
    run: () => <Line>{"you've entered vim. you can never leave. (hint: :q)"}</Line>,
  },
  ":q": {
    description: "",
    hidden: true,
    run: () => VIM_ESCAPE,
  },
  ":q!": {
    description: "",
    hidden: true,
    run: () => VIM_ESCAPE,
  },
  neofetch: {
    description: "",
    hidden: true,
    run: () => (
      <pre className="text-muted-foreground leading-snug">
        {`   ▲       ${site.handle}@${HOST}
  ▲ ▲      ──────────────────────────
 ▲▲▲▲▲     os: next.js 16 (app router)
           host: vercel
           shell: interactive-terminal
           font: hermit v2.0
           theme: dark
           uptime: shipping since 2023`}
      </pre>
    ),
  },
  cat: {
    description: "",
    hidden: true,
    run: (args) => {
      if (args.trim() === "secret.txt") {
        return <Line>{"you found it. now try 'rm -rf /' — what could go wrong?"}</Line>;
      }
      return <Line>{`cat: ${args || "missing operand"}: no such file or directory`}</Line>;
    },
  },
};

export const COMMAND_NAMES = Object.entries(commands)
  .filter(([, command]) => !command.hidden)
  .map(([name]) => name);
