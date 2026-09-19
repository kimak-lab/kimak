import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it } from "vitest";
import { ButtonGroup, buttonGroupAttrs } from "./index";

describe("ButtonGroup", () => {
  it("emits group anatomy and merges class", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(ButtonGroup, { class: "group-save", orientation: "vertical" }, () => "grouped");
        },
      }),
    );
    const root = wrapper.get("[data-scope='button-group']").element;
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("data-orientation", "vertical");
    expect(root).toHaveClass("group-save");
    expect(root).toHaveTextContent("grouped");
    wrapper.unmount();
  });
});

describe("buttonGroupAttrs", () => {
  it("defaults orientation to horizontal", () => {
    expect(buttonGroupAttrs()).toEqual({
      "data-scope": "button-group",
      "data-slot": "root",
      "data-orientation": "horizontal",
    });
  });
});
