/* eslint-disable react-hooks/static-components -- server-rendered, cached by code hash */
import * as runtime from "react/jsx-runtime";

import { mdxComponents } from "@/components/MdxComponents";

type MdxComponent = React.ComponentType<{
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}>;

export interface MdxProps {
  code: string;
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}

const cache = new Map<string, MdxComponent>();

function getComponent(code: string): MdxComponent {
  const cached = cache.get(code);
  if (cached) return cached;
  // velite emits CJS-style MDX runtime code; new Function + jsx runtime is the
  // sanctioned evaluation path. Source is build-time trusted content.
  const fn = new Function(code) as (scope: typeof runtime) => { default: MdxComponent };
  const Component = fn({ ...runtime }).default;
  cache.set(code, Component);
  return Component;
}

export function Mdx({ code, components }: MdxProps) {
  const Content = getComponent(code);
  return <Content components={{ ...mdxComponents, ...(components ?? {}) }} />;
}
