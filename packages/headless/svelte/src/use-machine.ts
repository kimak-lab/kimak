import type { Service } from "@kimak/core";

/** Minimal binder for the compiled package. Prefer `use-machine.svelte.ts` in Svelte apps. */
export function useMachine<TContext, TProps, TEvent extends { type: string }>(
  create: (props: TProps) => Service<TContext, TProps, TEvent>,
  props: TProps,
): Service<TContext, TProps, TEvent> {
  const service = create(props);
  service.setProps(props);
  return service;
}
