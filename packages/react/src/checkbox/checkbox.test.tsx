import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

function Example() {
  return (
    <Checkbox.Root>
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>Accept terms</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  );
}

describe("Checkbox", () => {
  it("toggles data-state and aria-checked on click", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const control = screen.getByRole("checkbox");
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(control).toHaveAttribute("data-state", "unchecked");
    expect(control).toHaveAttribute("data-slot", "control");
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(control).toHaveAttribute("data-state", "checked");
  });

  it("toggles with Space when focused", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const control = screen.getByRole("checkbox");
    control.focus();
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("merges asChild onto the consumer label", () => {
    render(
      <Checkbox.Root asChild>
        <label data-testid="custom">
          <Checkbox.Control />
          <Checkbox.HiddenInput />
        </label>
      </Checkbox.Root>,
    );
    const root = screen.getByTestId("custom");
    expect(root.tagName).toBe("LABEL");
    expect(root).toHaveAttribute("data-scope", "checkbox");
    expect(root).toHaveAttribute("data-slot", "root");
  });
});
