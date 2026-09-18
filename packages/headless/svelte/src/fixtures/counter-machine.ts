import { createService } from "@kimak/core";

export type CounterProps = { count: number };
export type CounterEvent = { type: "INCREMENT" };

export function createCounterMachine(props: CounterProps) {
  return createService<number, CounterProps, CounterEvent>({
    props,
    context: (initial) => initial.count,
    on: (context, event) => {
      switch (event.type) {
        case "INCREMENT":
          return context + 1;
        default: {
          const exhaustive: never = event.type;
          return exhaustive;
        }
      }
    },
  });
}
