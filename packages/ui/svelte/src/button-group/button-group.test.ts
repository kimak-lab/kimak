import { describe, expect, it } from "vitest";
import { render } from "@testing-library/svelte";
import {
  buttonGroupAttrs,
  buttonGroupSeparatorAttrs,
  buttonGroupTextAttrs,
} from "./button-group-attrs";
import Fixture from "./button-group.fixture.test.svelte";

describe("buttonGroupAttrs", () => {
  it("defaults orientation to horizontal", () => {
    expect(buttonGroupAttrs()).toEqual({
      "data-scope": "button-group",
      "data-slot": "root",
      "data-orientation": "horizontal",
    });
  });

  it("defaults separator orientation to vertical", () => {
    expect(buttonGroupSeparatorAttrs()).toEqual({
      "data-scope": "button-group",
      "data-slot": "separator",
      "data-orientation": "vertical",
    });
    expect(buttonGroupSeparatorAttrs({ orientation: "horizontal" })["data-orientation"]).toBe(
      "horizontal",
    );
  });

  it("names the text part", () => {
    expect(buttonGroupTextAttrs()).toEqual({
      "data-scope": "button-group",
      "data-slot": "text",
    });
  });
});

describe("ButtonGroup parts", () => {
  it("expose group, separator, and text semantics", () => {
    const view = render(Fixture);

    const group = view.getByRole("group", { name: "Text alignment" });
    expect(group).toHaveAttribute("data-slot", "root");
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(group).toHaveClass("group-save");
    expect(view.getAllByRole("button")).toHaveLength(2);

    const toolbar = view.getByRole("toolbar", { name: "Formatting" });
    expect(toolbar).toHaveAttribute("data-orientation", "vertical");

    const separators = view.getAllByRole("separator");
    expect(separators[0]).toHaveAttribute("aria-orientation", "vertical");
    expect(view.getByTestId("horizontal")).toHaveAttribute("aria-orientation", "horizontal");

    expect(view.getByText("https://").tagName).toBe("DIV");
    expect(view.getByText("https://")).toHaveAttribute("data-slot", "text");
    expect(view.getByLabelText("URL").tagName).toBe("INPUT");
  });
});
