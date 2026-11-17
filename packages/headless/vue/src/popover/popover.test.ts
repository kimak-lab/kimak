import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { popoverSpec, type KeyCode } from "@kimak/spec";
import { defineComponent, h, nextTick, ref, type Component } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Popover } from "./popover";

const Example = defineComponent({
  name: "PopoverExample",
  inheritAttrs: false,
  props: { withTitle: { type: Boolean, default: true } },
  setup(props, { attrs }) {
    return () => [
      h(Popover.Root, attrs, () => [
        h(Popover.Trigger, null, () => "Settings"),
        h(Popover.Positioner, null, () =>
          h(Popover.Content, null, () => [
            props.withTitle ? h(Popover.Title, null, () => "Display") : null,
            h(Popover.Description, null, () => "Pick a density."),
            h("button", { type: "button" }, "Compact"),
            h(Popover.Close, null, () => "Done"),
          ]),
        ),
      ]),
      h("button", { type: "button" }, "Outside"),
    ];
  },
});

type User = ReturnType<typeof userEvent.setup>;

async function press(user: User, code: KeyCode) {
  switch (code) {
    case "Space":
      await user.keyboard(" ");
      return;
    case "Enter":
      await user.keyboard("{Enter}");
      return;
    case "Escape":
      await user.keyboard("{Escape}");
      return;
    case "Tab":
      await user.keyboard("{Tab}");
      return;
    default: {
      const exhaustive: never = code;
      throw new Error(`Unhandled key ${exhaustive}`);
    }
  }
}

function button(name: string): HTMLElement {
  const match = Array.from(document.querySelectorAll<HTMLElement>("button")).find(
    (node) => node.textContent?.trim() === name,
  );
  if (!match) throw new Error(`No button named ${name}`);
  return match;
}

const trigger = () => button("Settings");
const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]');

let unmount: (() => void) | undefined;

function render(component: Component, props: Record<string, unknown> = {}) {
  const wrapper = mount(component, { props, attachTo: document.body });
  unmount = () => wrapper.unmount();
  return wrapper;
}

afterEach(() => {
  unmount?.();
  unmount = undefined;
});

describe("Popover", () => {
  it("does not mount content while closed", () => {
    render(Example);
    expect(trigger()).toHaveAttribute("data-scope", "popover");
    expect(trigger()).toHaveAttribute("data-slot", "trigger");
    expect(trigger()).toHaveAttribute("data-state", "closed");
    expect(trigger()).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).not.toHaveAttribute("aria-controls");
    expect(dialog()).toBeNull();
  });

  it("opens on click, wires aria, and moves focus into content", async () => {
    const user = userEvent.setup();
    render(Example);
    await user.click(trigger());

    const content = dialog() as HTMLElement;
    expect(content).not.toBeNull();
    expect(content).toHaveAccessibleName("Display");
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).toHaveAttribute("data-side", "bottom");
    expect(content).toHaveAccessibleDescription("Pick a density.");
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(trigger()).toHaveAttribute("aria-controls", content.id);
    expect(trigger()).toHaveAttribute("data-state", "open");
    expect(button("Compact")).toHaveFocus();

    const positioner = content.parentElement;
    expect(positioner).toHaveAttribute("data-slot", "positioner");
    expect(positioner?.style.position).toBe("fixed");
  });

  it("omits aria-labelledby when no title is rendered", async () => {
    const user = userEvent.setup();
    render(Example, { withTitle: false });
    await user.click(trigger());
    expect(dialog()).not.toHaveAttribute("aria-labelledby");
  });

  it.each(popoverSpec.keyboard)("$code on $slot: $then", async (binding) => {
    const user = userEvent.setup();
    render(Example);

    switch (binding.code) {
      case "Enter":
      case "Space": {
        trigger().focus();
        await press(user, binding.code);
        expect(dialog()).not.toBeNull();
        trigger().focus();
        await press(user, binding.code);
        expect(dialog()).toBeNull();
        return;
      }
      case "Escape": {
        await user.click(trigger());
        expect(dialog()).not.toBeNull();
        await press(user, binding.code);
        expect(dialog()).toBeNull();
        expect(trigger()).toHaveFocus();
        return;
      }
      case "Tab": {
        await user.click(trigger());
        button("Done").focus();
        await press(user, binding.code);
        expect(button("Outside")).toHaveFocus();
        expect(dialog()).toBeNull();
        return;
      }
      default: {
        const exhaustive: never = binding;
        throw new Error(`Unhandled binding ${String(exhaustive)}`);
      }
    }
  });

  it("closes on pointer down outside without stealing focus back", async () => {
    const user = userEvent.setup();
    render(Example);
    await user.click(trigger());
    await user.click(button("Outside"));
    expect(dialog()).toBeNull();
    expect(button("Outside")).toHaveFocus();
  });

  it("stays open on outside interaction when closeOnInteractOutside is false", async () => {
    const user = userEvent.setup();
    render(Example, { closeOnInteractOutside: false });
    await user.click(trigger());
    await user.click(button("Outside"));
    expect(dialog()).not.toBeNull();
  });

  it("closes from Popover.Close and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(Example, { onOpenChange });
    await user.click(trigger());
    await user.click(button("Done"));
    expect(dialog()).toBeNull();
    expect(trigger()).toHaveFocus();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it("follows a controlled v-model:open", async () => {
    const user = userEvent.setup();
    const open = ref(false);
    render(
      defineComponent({
        setup() {
          return () => [
            h("span", { "data-testid": "state" }, open.value ? "open" : "closed"),
            h(Example, {
              open: open.value,
              "onUpdate:open": (next: boolean) => {
                open.value = next;
              },
            }),
          ];
        },
      }),
    );
    const state = () => document.querySelector('[data-testid="state"]');
    await user.click(trigger());
    await nextTick();
    expect(state()).toHaveTextContent("open");
    expect(dialog()).not.toBeNull();
    await user.keyboard("{Escape}");
    await nextTick();
    expect(state()).toHaveTextContent("closed");
    expect(dialog()).toBeNull();
  });

  it("renders the trigger as another tag through as", () => {
    render(
      defineComponent({
        setup() {
          return () =>
            h(Popover.Root, null, () =>
              h(Popover.Trigger, { as: "span", "data-testid": "custom" }, () => "Open"),
            );
        },
      }),
    );
    const custom = document.querySelector('[data-testid="custom"]');
    expect(custom?.tagName).toBe("SPAN");
    expect(custom).toHaveAttribute("data-slot", "trigger");
    expect(custom).toHaveAttribute("aria-haspopup", "dialog");
  });
});
