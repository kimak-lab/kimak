import type { Service } from "@kimak/core";

export function useMachine<TContext, TProps, TEvent extends { type: string }>(
  create: (props: TProps) => Service<TContext, TProps, TEvent>,
  getProps: () => TProps,
): Service<TContext, TProps, TEvent> {
  let service = $state(create(getProps()));
  let revision = $state(0);

  $effect(() => {
    service.setProps(getProps());
  });

  $effect(() => {
    return service.subscribe(() => {
      revision += 1;
    });
  });

  return {
    getSnapshot: () => {
      revision;
      return service.getSnapshot();
    },
    send: (event: TEvent) => service.send(event),
    setProps: (props: TProps) => service.setProps(props),
    subscribe: (listener: () => void) => service.subscribe(listener),
    get refs() {
      return service.refs;
    },
  } as Service<TContext, TProps, TEvent>;
}
