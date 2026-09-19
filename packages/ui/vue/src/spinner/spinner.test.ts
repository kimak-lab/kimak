import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it } from "vitest";
import { Spinner, spinnerAttrs } from "./index";

describe("Spinner", () => {
  it("emits spinner anatomy and merges class", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Spinner, { class: "spin-save" });
        },
      }),
    );
    const root = wrapper.get("[data-scope='spinner']").element;
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("spin-save");
    wrapper.unmount();
  });
});

describe("spinnerAttrs", () => {
  it("emits anatomy selectors", () => {
    expect(spinnerAttrs()).toEqual({
      "data-scope": "spinner",
      "data-slot": "root",
    });
  });
});
