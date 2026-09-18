import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox sugar", () => {
  it("assembles parts from children as the label", async () => {
    const user = userEvent.setup();
    render(<Checkbox data-size="sm">Accept terms</Checkbox>);
    const control = screen.getByRole("checkbox");
    expect(control).toHaveAttribute("aria-checked", "false");
    await user.click(screen.getByText("Accept terms"));
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(document.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });
});
