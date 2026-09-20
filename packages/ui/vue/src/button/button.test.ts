import userEvent from "@testing-library/user-event";
import { mount } from "@vue/test-utils";
import { gsap } from "gsap";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonAttrs } from "./index";

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

  it("maps variant and size props to data attributes", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Button, { variant: "outline", size: "sm" }, () => "Save");
        },
      }),
      { attachTo: document.body },
    );
    const root = wrapper.get("button").element;
    expect(root).toHaveAttribute("data-variant", "outline");
    expect(root).toHaveAttribute("data-size", "sm");
    wrapper.unmount();
  });

  it("lets host data-* win over variant and size", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Button,
              { variant: "ghost", size: "lg", "data-variant": "outline", "data-size": "sm" },
              () => "Save",
            );
        },
      }),
      { attachTo: document.body },
    );
    const root = wrapper.get("button").element;
    expect(root).toHaveAttribute("data-variant", "outline");
    expect(root).toHaveAttribute("data-size", "sm");
    wrapper.unmount();
  });

  it("keeps focus while loading", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Button, { loading: true, onPress }, () => "Save");
        },
      }),
      { attachTo: document.body },
    );
    const root = wrapper.get("button").element as HTMLButtonElement;
    expect(root).not.toBeDisabled();
    expect(root).toHaveAttribute("aria-busy", "true");
    await user.click(root);
    expect(onPress).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("composes onto an anchor without native button attrs", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Button, { as: "a", href: "/docs" }, () => "Docs");
        },
      }),
      { attachTo: document.body },
    );
    const root = wrapper.get("a").element;
    expect(root.tagName).toBe("A");
    expect(root).toHaveAttribute("href", "/docs");
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).not.toHaveAttribute("type");
    expect(wrapper.find("button").exists()).toBe(false);
    wrapper.unmount();
  });

  it("does not write motion onto look data attributes", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Button, { motion: "bounce", variant: "outline" }, () => "Save");
        },
      }),
      { attachTo: document.body },
    );
    const root = wrapper.get("button").element;
    expect(root).toHaveAttribute("data-variant", "outline");
    expect(root.hasAttribute("data-motion")).toBe(false);
    wrapper.unmount();
  });

  it("skips press scale when motion is none", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Button, { motion: "none" }, () => "Save");
        },
      }),
      { attachTo: document.body },
    );
    const root = wrapper.get("button").element;
    root.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    expect(Number(gsap.getProperty(root, "scale"))).toBe(1);
    wrapper.unmount();
  });
});

describe("buttonAttrs", () => {
  it("emits anatomy selectors and look data attributes", () => {
    expect(buttonAttrs({ variant: "outline", size: "sm" })).toEqual({
      "data-scope": "button",
      "data-slot": "root",
      "data-variant": "outline",
      "data-size": "sm",
    });
  });

  it("lets explicit data-* win over variant and size", () => {
    expect(
      buttonAttrs({ variant: "ghost", "data-variant": "outline" })["data-variant"],
    ).toBe("outline");
  });
});
