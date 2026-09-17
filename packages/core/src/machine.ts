export interface Snapshot<TContext, TProps> {
  context: TContext;
  props: TProps;
}

export interface Service<TContext, TProps, TEvent extends { type: string }> {
  send: (event: TEvent) => void;
  getSnapshot: () => Snapshot<TContext, TProps>;
  subscribe: (listener: () => void) => () => void;
  setProps: (props: TProps) => void;
  refs: Record<string, HTMLElement | null>;
}

export interface MachineOptions<TContext, TProps, TEvent extends { type: string }> {
  props: TProps;
  context: (props: TProps) => TContext;
  on: (
    context: TContext,
    event: TEvent,
    meta: { props: TProps; refs: Record<string, HTMLElement | null> },
  ) => TContext;
}

export function createService<TContext, TProps, TEvent extends { type: string }>(
  options: MachineOptions<TContext, TProps, TEvent>,
): Service<TContext, TProps, TEvent> {
  let props = options.props;
  let context = options.context(props);
  let snapshot: Snapshot<TContext, TProps> = { context, props };
  const refs: Record<string, HTMLElement | null> = {};
  const listeners = new Set<() => void>();

  const assignSnapshot = () => {
    snapshot = { context, props };
  };

  const notify = () => {
    for (const listener of listeners) listener();
  };

  return {
    refs,
    getSnapshot: () => snapshot,
    setProps: (next) => {
      props = next;
      assignSnapshot();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    send: (event) => {
      const next = options.on(context, event, { props, refs });
      if (next !== context) {
        context = next;
        assignSnapshot();
        notify();
      }
    },
  };
}
