import userEvent from "@testing-library/user-event";
import { mount } from "@vue/test-utils";
import { buttonSpec, type KeyCode } from "@kimak/spec";
import { defineComponent, h, nextTick, ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

function Example(props: {
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onPress?: () => void;
  name?: string;
  value?: string;
}) {
  return defineComponent({
    setup() {
      return () =>
        h(Button.Root, props, () => ["Save", h(Button.Indicator)]);
    },
  });
}

async function press(user: ReturnType<typeof userEvent.setup>, code: KeyCode) {
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

function getButton(wrapper: ReturnType<typeof mount>) {
  return wrapper.get("button").element as HTMLButtonElement;
}

describe("Button", () => {
  it("exposes root anatomy and fires onPress on click", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const wrapper = mount(Example({ onPress }), { attachTo: document.body });
    const root = getButton(wrapper);
    expect(root).toHaveAttribute("data-scope", "button");
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("type", "button");
    expect(root.querySelector('[data-slot="indicator"]')).not.toBeNull();
    await user.click(root);
    expect(onPress).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it("forwards data-size as a host attribute", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Button.Root, { "data-size": "sm" }, () => ["Save", h(Button.Indicator)]);
        },
      }),
      { attachTo: document.body },
    );
    expect(getButton(wrapper)).toHaveAttribute("data-size", "sm");
    wrapper.unmount();
  });

  it("forwards consumer class onto root and indicator", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Button.Root, { class: "btn-save" }, () => [
              "Save",
              h(Button.Indicator, { class: "btn-spin" }),
            ]);
        },
      }),
      { attachTo: document.body },
    );
    const root = getButton(wrapper);
    expect(root).toHaveClass("btn-save");
    expect(root.querySelector('[data-slot="indicator"]')).toHaveClass("btn-spin");
    wrapper.unmount();
  });

  it("does not fire onPress when disabled", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const wrapper = mount(Example({ disabled: true, onPress }), { attachTo: document.body });
    const root = getButton(wrapper);
    expect(root).toBeDisabled();
    expect(root).toHaveAttribute("data-disabled");
    expect(root).toHaveAttribute("aria-disabled", "true");
    await user.click(root);
    expect(onPress).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("does not fire onPress when loading", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const wrapper = mount(Example({ loading: true, onPress }), { attachTo: document.body });
    const root = getButton(wrapper);
    expect(root).toBeDisabled();
    expect(root).toHaveAttribute("data-loading");
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root.querySelector('[data-slot="indicator"]')).toHaveAttribute("data-loading");
    await user.click(root);
    expect(onPress).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it.each(buttonSpec.keyboard)("$code on $slot presses the button", async (binding) => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const wrapper = mount(Example({ onPress }), { attachTo: document.body });
    getButton(wrapper).focus();
    await press(user, binding.code);
    expect(onPress).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it("submits the form when type is submit", async () => {
    const user = userEvent.setup();
    let submitted: FormData | undefined;
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              "form",
              {
                onSubmit: (event: Event) => {
                  event.preventDefault();
                  submitted = new FormData(event.currentTarget as HTMLFormElement);
                },
              },
              [
                h("input", { name: "title", value: "hello" }),
                h(Button.Root, { type: "submit" }, () => ["Save", h(Button.Indicator)]),
              ],
            );
        },
      }),
      { attachTo: document.body },
    );
    await user.click(wrapper.get("button").element);
    expect(submitted?.get("title")).toBe("hello");
    wrapper.unmount();
  });

  it("forwards a controlled loading flag", async () => {
    const user = userEvent.setup();
    const wrapper = mount(
      defineComponent({
        setup() {
          const loading = ref(false);
          return () =>
            h(
              Button.Root,
              {
                loading: loading.value,
                onPress: () => {
                  loading.value = true;
                },
              },
              () => ["Save", h(Button.Indicator)],
            );
        },
      }),
      { attachTo: document.body },
    );
    const root = getButton(wrapper);
    expect(root).not.toHaveAttribute("data-loading");
    await user.click(root);
    await nextTick();
    expect(getButton(wrapper)).toHaveAttribute("data-loading");
    wrapper.unmount();
  });
});
