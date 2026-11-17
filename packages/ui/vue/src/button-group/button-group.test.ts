import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it } from "vitest";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupAttrs,
  buttonGroupSeparatorAttrs,
  buttonGroupTextAttrs,
} from "./index";

function mountRender(render: () => ReturnType<typeof h>) {
  return mount(defineComponent({ setup: () => render }));
}

describe("ButtonGroup", () => {
  it("emits group anatomy and merges class", () => {
    const wrapper = mountRender(() =>
      h(ButtonGroup, { class: "group-save", orientation: "vertical" }, () => "grouped"),
    );
    const root = wrapper.get("[data-scope='button-group']").element;
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("data-orientation", "vertical");
    expect(root).toHaveClass("group-save");
    expect(root).toHaveTextContent("grouped");
    wrapper.unmount();
  });

  it("exposes role=group and lets the consumer replace it", () => {
    const wrapper = mountRender(() =>
      h("div", [
        h(ButtonGroup, { "aria-label": "Alignment", id: "a" }),
        h(ButtonGroup, { role: "toolbar", id: "b" }),
      ]),
    );
    expect(wrapper.get("#a").element).toHaveAttribute("role", "group");
    expect(wrapper.get("#a").element).toHaveAttribute("aria-label", "Alignment");
    expect(wrapper.get("#a").element).toHaveAttribute("data-orientation", "horizontal");
    expect(wrapper.get("#b").element).toHaveAttribute("role", "toolbar");
    wrapper.unmount();
  });
});

describe("ButtonGroupSeparator", () => {
  it("is a vertical separator by default and follows orientation", () => {
    const wrapper = mountRender(() =>
      h("div", [h(ButtonGroupSeparator, { id: "v" }), h(ButtonGroupSeparator, { id: "h", orientation: "horizontal" })]),
    );
    const vertical = wrapper.get("#v").element;
    expect(vertical).toHaveAttribute("role", "separator");
    expect(vertical).toHaveAttribute("data-slot", "separator");
    expect(vertical).toHaveAttribute("aria-orientation", "vertical");
    expect(vertical).toHaveAttribute("data-orientation", "vertical");
    expect(wrapper.get("#h").element).toHaveAttribute("aria-orientation", "horizontal");
    wrapper.unmount();
  });
});

describe("ButtonGroupText", () => {
  it("renders a div by default and a label with as", () => {
    const wrapper = mountRender(() =>
      h("div", [
        h(ButtonGroupText, { id: "d" }, () => "https://"),
        h(ButtonGroupText, { id: "l", as: "label", for: "url" }, () => "URL"),
      ]),
    );
    expect(wrapper.get("#d").element.tagName).toBe("DIV");
    expect(wrapper.get("#d").element).toHaveAttribute("data-slot", "text");
    const label = wrapper.get("#l").element;
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("for", "url");
    expect(label).toHaveAttribute("data-scope", "button-group");
    wrapper.unmount();
  });
});

describe("button group attrs", () => {
  it("stays look-only with orientation defaults", () => {
    expect(buttonGroupAttrs()).toEqual({
      "data-scope": "button-group",
      "data-slot": "root",
      "data-orientation": "horizontal",
    });
    expect(buttonGroupSeparatorAttrs()["data-orientation"]).toBe("vertical");
    expect(buttonGroupTextAttrs()).toEqual({ "data-scope": "button-group", "data-slot": "text" });
  });
});
