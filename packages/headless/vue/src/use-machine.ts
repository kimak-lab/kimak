import type { Service } from "@kimak/core";
import { getCurrentInstance, onScopeDispose, shallowRef, watchEffect } from "vue";

export function useMachine<TContext, TProps, TEvent extends { type: string }>(
  create: (props: TProps) => Service<TContext, TProps, TEvent>,
  getProps: () => TProps,
): Service<TContext, TProps, TEvent> {
  const serviceRef = shallowRef<Service<TContext, TProps, TEvent> | null>(null);
  const version = shallowRef(0);

  if (!serviceRef.value) {
    serviceRef.value = create(getProps());
  }

  const service = serviceRef.value;

  watchEffect(() => {
    service.setProps(getProps());
    version.value += 1;
  });

  if (getCurrentInstance()) {
    onScopeDispose(
      service.subscribe(() => {
        version.value += 1;
      }),
    );
  }

  return new Proxy(service, {
    get(target, prop, receiver) {
      if (prop === "getSnapshot") {
        void version.value;
        return target.getSnapshot.bind(target);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}
