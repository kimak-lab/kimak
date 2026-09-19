import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonAttrs } from "./index";

describe("Button sugar", () => {
  it("assembles root and indicator from children as the accessible name", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button data-size="sm" onPress={onPress}>
        Save
      </Button>,
    );
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("data-size", "sm");
    expect(root.querySelector('[data-slot="indicator"]')).not.toBeNull();
    await user.click(root);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("forwards consumer className onto the host", () => {
    render(<Button className="btn-save">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("btn-save");
  });

  it("maps variant and size props to data attributes", () => {
    render(
      <Button variant="outline" size="sm">
        Save
      </Button>,
    );
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).toHaveAttribute("data-variant", "outline");
    expect(root).toHaveAttribute("data-size", "sm");
  });

  it("lets host data-* win over variant and size", () => {
    render(
      <Button variant="ghost" size="lg" data-variant="outline" data-size="sm">
        Save
      </Button>,
    );
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).toHaveAttribute("data-variant", "outline");
    expect(root).toHaveAttribute("data-size", "sm");
  });

  it("keeps focus while loading", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button loading onPress={onPress}>
        Save
      </Button>,
    );
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).not.toBeDisabled();
    expect(root).toHaveAttribute("aria-busy", "true");
    await user.click(root);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("composes onto an anchor without native button attrs", () => {
    render(
      <Button render={<a href="/docs" />}>
        Docs
      </Button>,
    );
    const root = screen.getByRole("link", { name: "Docs" });
    expect(root.tagName).toBe("A");
    expect(root).toHaveAttribute("href", "/docs");
    expect(root).toHaveAttribute("data-scope", "button");
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).not.toHaveAttribute("type");
    expect(root).not.toHaveAttribute("disabled");
    expect(document.querySelectorAll("button")).toHaveLength(0);
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
