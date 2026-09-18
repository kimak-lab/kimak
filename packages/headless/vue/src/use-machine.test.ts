import { createService, type Service } from "@kimak/core";
import { mount } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import { describe, expect, it } from "vitest";
import { useMachine } from "./use-machine";

type CounterProps = { count: number };
type CounterEvent = { type: "INCREMENT" };

function createCounterMachine(props: CounterProps) {
  return createService<number, CounterProps, CounterEvent>({
    props,
    context: (initial) => initial.count,
    on: (context, event) => {
      if (event.type === "INCREMENT") return context + 1;
      throw new Error("Unhandled counter event");
    },
  });
}

describe("useMachine", () => {
  it("updates props and re-renders on send", async () => {
    const holder: { service: Service<number, CounterProps, CounterEvent> | null } = {
      service: null,
    };

    const Counter = defineComponent({
      props: {
        count: {
          type: Number,
          required: true,
        },
      },
      setup(props) {
        holder.service = useMachine(createCounterMachine, () => ({ count: props.count }));
        return () => holder.service?.getSnapshot().context ?? 0;
      },
    });

    const wrapper = mount(Counter, { props: { count: 0 } });
    expect(wrapper.text()).toBe("0");

    holder.service?.send({ type: "INCREMENT" });
    await nextTick();
    expect(wrapper.text()).toBe("1");

    await wrapper.setProps({ count: 5 });
    expect(holder.service?.getSnapshot().props.count).toBe(5);
    expect(wrapper.text()).toBe("1");
  });
});
