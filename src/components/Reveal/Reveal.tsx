"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface RevealProps {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function Reveal({ className, delay = 0, children }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.24, ease: EASE_OUT, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
