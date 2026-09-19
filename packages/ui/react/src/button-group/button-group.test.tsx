import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonGroup, buttonGroupAttrs } from "./index";

describe("ButtonGroup", () => {
  it("emits group anatomy and merges className", () => {
    const { container } = render(
      <ButtonGroup className="group-save" orientation="vertical">
        grouped
      </ButtonGroup>,
    );
    const root = container.querySelector("[data-scope='button-group']");
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("data-orientation", "vertical");
    expect(root).toHaveClass("group-save");
    expect(root).toHaveTextContent("grouped");
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
