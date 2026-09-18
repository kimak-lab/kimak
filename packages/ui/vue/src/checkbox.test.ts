import userEvent from "@testing-library/user-event";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox sugar", () => {
  it("assembles parts from children as the label", async () => {
    const user = userEvent.setup();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Checkbox, { "data-size": "sm" }, () => "Accept terms");
        },
      }),
      { attachTo: document.body },
    );
    const control = wrapper.get('[role="checkbox"]').element;
    expect(control).toHaveAttribute("aria-checked", "false");
    await user.click(wrapper.get('[data-slot="label"]').element);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(wrapper.get('input[type="checkbox"]').element).toBeTruthy();
    wrapper.unmount();
  });
});
