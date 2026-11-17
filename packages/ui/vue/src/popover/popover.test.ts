import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { defineComponent, h } from "vue";
import { describe, expect, it } from "vitest";
import { Popover, popoverContentAttrs, usePopover } from "./index";

const Choice = defineComponent({
  props: { label: { type: String, required: true } },
  setup(props) {
    const getPopover = usePopover();
    return () =>
      h("button", { type: "button", onClick: () => getPopover().setOpen(false) }, props.label);
  },
});

function mountPopover(contentProps: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      setup() {
        return () =>
          h("div", { "data-testid": "host" }, [
            h(Popover, null, () => [
              h(Popover.Trigger, null, () => "Open"),
              h(Popover.Content, contentProps, () => [
                h(Popover.Title, null, () => "Library"),
                h(Choice, { label: "Tabler" }),
              ]),
            ]),
          ]);
      },
    }),
    { attachTo: document.body },
  );
}

function button(name: string): HTMLElement {
  const match = Array.from(document.querySelectorAll<HTMLElement>("button")).find(
    (node) => node.textContent?.trim() === name,
  );
  if (!match) throw new Error(`No button named ${name}`);
  return match;
}

const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]');

describe("Popover sugar", () => {
  it("portals positioner and content to document.body", async () => {
    const user = userEvent.setup();
    const wrapper = mountPopover();
    await user.click(button("Open"));
    const content = dialog();
    expect(content).toHaveAccessibleName("Library");
    expect(wrapper.element.contains(content)).toBe(false);
    expect(content?.parentElement).toHaveAttribute("data-slot", "positioner");
    expect(content?.parentElement?.parentElement).toBe(document.body);
    wrapper.unmount();
  });

  it("renders inline when portalled is false and closes through usePopover", async () => {
    const user = userEvent.setup();
    const wrapper = mountPopover({ portalled: false, class: "w-72" });
    await user.click(button("Open"));
    expect(wrapper.element.contains(dialog())).toBe(true);
    expect(dialog()).toHaveClass("w-72");
    await user.click(button("Tabler"));
    expect(dialog()).toBeNull();
    expect(button("Open")).toHaveFocus();
    wrapper.unmount();
  });

  it("exposes look-only content attrs", () => {
    expect(popoverContentAttrs()).toEqual({ "data-scope": "popover", "data-slot": "content" });
  });
});
