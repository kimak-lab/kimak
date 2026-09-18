import userEvent from "@testing-library/user-event";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button sugar", () => {
  it("assembles root and indicator from children as the accessible name", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Button, { "data-size": "sm", onPress }, () => "Save");
        },
      }),
      { attachTo: document.body },
    );
    const root = wrapper.get("button").element;
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("data-size", "sm");
    expect(root.querySelector('[data-slot="indicator"]')).not.toBeNull();
    await user.click(root);
    expect(onPress).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it("forwards consumer class onto the host", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Button, { class: "btn-save" }, () => "Save");
        },
      }),
      { attachTo: document.body },
    );
    expect(wrapper.get("button").element).toHaveClass("btn-save");
    wrapper.unmount();
  });
});
