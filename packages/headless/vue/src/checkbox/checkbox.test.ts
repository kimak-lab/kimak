import userEvent from "@testing-library/user-event";
import { mount } from "@vue/test-utils";
import { checkboxSpec } from "@kimak/spec";
import { defineComponent, h, nextTick, ref } from "vue";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

function Example(props: {
  disabled?: boolean;
  readOnly?: boolean;
  defaultChecked?: boolean | "indeterminate";
  name?: string;
  value?: string;
}) {
  return defineComponent({
    setup() {
      return () =>
        h(Checkbox.Root, props, () => [
          h(Checkbox.Control, () => h(Checkbox.Indicator)),
          h(Checkbox.Label, () => "Accept terms"),
          h(Checkbox.HiddenInput),
        ]);
    },
  });
}

describe("Checkbox", () => {
  it("toggles data-state and aria-checked on click", async () => {
    const user = userEvent.setup();
    const wrapper = mount(Example({}), { attachTo: document.body });
    const control = wrapper.get('[role="checkbox"]').element;
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(control).toHaveAttribute("data-state", "unchecked");
    expect(control).toHaveAttribute("data-slot", "control");
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(control).toHaveAttribute("data-state", "checked");
    wrapper.unmount();
  });

  it("exposes mixed as aria-checked=mixed", () => {
    const wrapper = mount(Example({ defaultChecked: "indeterminate" }), {
      attachTo: document.body,
    });
    const control = wrapper.get('[role="checkbox"]').element;
    expect(control).toHaveAttribute("aria-checked", "mixed");
    expect(control).toHaveAttribute("data-state", "indeterminate");
    wrapper.unmount();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const wrapper = mount(Example({ disabled: true }), { attachTo: document.body });
    const control = wrapper.get('[role="checkbox"]').element;
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "false");
    wrapper.unmount();
  });

  it("does not toggle when readOnly", async () => {
    const user = userEvent.setup();
    const wrapper = mount(Example({ readOnly: true }), { attachTo: document.body });
    const control = wrapper.get('[role="checkbox"]').element as HTMLElement;
    control.focus();
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "false");
    wrapper.unmount();
  });

  it("Enter does not toggle the checkbox", async () => {
    const user = userEvent.setup();
    const wrapper = mount(Example({}), { attachTo: document.body });
    const control = wrapper.get('[role="checkbox"]').element as HTMLElement;
    control.focus();
    await user.keyboard("{Enter}");
    expect(control).toHaveAttribute("aria-checked", "false");
    wrapper.unmount();
  });

  it.each(checkboxSpec.keyboard)("$code on $slot toggles the checkbox", async (binding) => {
    expect(`${binding.code}:${binding.slot}`).toBe("Space:control");
    const user = userEvent.setup();
    const wrapper = mount(Example({}), { attachTo: document.body });
    const control = wrapper.get('[role="checkbox"]').element as HTMLElement;
    control.focus();
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "true");
    wrapper.unmount();
  });

  it("toggles once from the label and once from the control", async () => {
    const user = userEvent.setup();
    const wrapper = mount(Example({}), { attachTo: document.body });
    const control = wrapper.get('[role="checkbox"]').element;
    await user.click(wrapper.get('[data-slot="label"]').element);
    expect(control).toHaveAttribute("aria-checked", "true");
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "false");
    wrapper.unmount();
  });

  it("submits the hidden input with the form when checked", async () => {
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
                h(Example({ name: "terms", value: "yes" })),
                h("button", { type: "submit" }, "Save"),
              ],
            );
        },
      }),
      { attachTo: document.body },
    );
    await user.click(wrapper.get('[role="checkbox"]').element);
    await user.click(wrapper.get('button[type="submit"]').element);
    expect(submitted?.get("terms")).toBe("yes");
    wrapper.unmount();
  });

  it("syncs a controlled checked value", async () => {
    const user = userEvent.setup();
    const wrapper = mount(
      defineComponent({
        setup() {
          const checked = ref(false);
          return () =>
            h(
              Checkbox.Root,
              {
                checked: checked.value,
                onCheckedChange: (details) => {
                  checked.value = details.checked === true;
                },
              },
              () => [
                h(Checkbox.Control),
                h(Checkbox.Label, () => "Controlled"),
                h(Checkbox.HiddenInput),
              ],
            );
        },
      }),
      { attachTo: document.body },
    );
    const control = wrapper.get('[role="checkbox"]').element;
    await user.click(control);
    await nextTick();
    expect(wrapper.get('[role="checkbox"]').element).toHaveAttribute("aria-checked", "true");
    wrapper.unmount();
  });
});
