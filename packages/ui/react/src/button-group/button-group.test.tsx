import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupAttrs,
  buttonGroupSeparatorAttrs,
  buttonGroupTextAttrs,
} from "./index";

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

  it("exposes role=group named by aria-label", () => {
    render(
      <ButtonGroup aria-label="Text alignment">
        <Button>Left</Button>
        <Button>Right</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group", { name: "Text alignment" });
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("lets the consumer replace the role", () => {
    render(<ButtonGroup role="toolbar" aria-label="Formatting" />);
    expect(screen.getByRole("toolbar", { name: "Formatting" })).toBeInTheDocument();
  });
});

describe("ButtonGroupSeparator", () => {
  it("is a vertical separator by default", () => {
    render(<ButtonGroupSeparator />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("data-scope", "button-group");
    expect(separator).toHaveAttribute("data-slot", "separator");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });

  it("follows the orientation prop", () => {
    render(<ButtonGroupSeparator orientation="horizontal" />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
  });
});

describe("ButtonGroupText", () => {
  it("renders a div with text anatomy", () => {
    render(<ButtonGroupText>https://</ButtonGroupText>);
    const text = screen.getByText("https://");
    expect(text.tagName).toBe("DIV");
    expect(text).toHaveAttribute("data-scope", "button-group");
    expect(text).toHaveAttribute("data-slot", "text");
  });

  it("composes onto a label with render", () => {
    render(
      <>
        <ButtonGroupText render={<label htmlFor="url" />} className="pill">
          URL
        </ButtonGroupText>
        <input id="url" />
      </>,
    );
    const label = screen.getByText("URL");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("data-slot", "text");
    expect(label).toHaveClass("pill");
    expect(screen.getByLabelText("URL").tagName).toBe("INPUT");
  });
});

describe("button group attrs", () => {
  it("defaults root orientation to horizontal and stays look-only", () => {
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
    expect(buttonGroupTextAttrs()).toEqual({
      "data-scope": "button-group",
      "data-slot": "text",
    });
  });
});
