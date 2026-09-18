import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

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
});
