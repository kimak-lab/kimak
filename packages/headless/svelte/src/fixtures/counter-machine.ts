import { createService } from "@kimak/core";

export type CounterProps = { count: number };
export type CounterEvent = { type: "INCREMENT" };

export function createCounterMachine(props: CounterProps) {
  return createService<number, CounterProps, CounterEvent>({
    props,
    context: (initial) => initial.count,
    on: (context, event) => {
      if (event.type === "INCREMENT") return context + 1;
      throw new Error("Unhandled counter event");
    },
  });
}
