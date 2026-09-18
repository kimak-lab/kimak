import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { checkboxSpec } from "@kimak/spec";
import { describe, expect, it } from "vitest";
import Example from "./example.svelte";

describe("Checkbox", () => {
  it("toggles data-state and aria-checked on click", async () => {
    const user = userEvent.setup();
    render(Example);
    const control = screen.getByRole("checkbox");
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(control).toHaveAttribute("data-state", "unchecked");
    expect(control).toHaveAttribute("data-slot", "control");
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(control).toHaveAttribute("data-state", "checked");
  });

  it("exposes mixed as aria-checked=mixed", () => {
    render(Example, { defaultChecked: "indeterminate" });
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "indeterminate");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(Example, { disabled: true });
    const control = screen.getByRole("checkbox");
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("does not toggle when readOnly", async () => {
    const user = userEvent.setup();
    render(Example, { readOnly: true });
    const control = screen.getByRole("checkbox");
    control.focus();
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("Enter does not toggle the checkbox", async () => {
    const user = userEvent.setup();
    render(Example);
    const control = screen.getByRole("checkbox");
    control.focus();
    await user.keyboard("{Enter}");
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it.each(checkboxSpec.keyboard)("$code on $slot toggles the checkbox", async (binding) => {
    expect(`${binding.code}:${binding.slot}`).toBe("Space:control");
    const user = userEvent.setup();
    render(Example);
    const control = screen.getByRole("checkbox");
    control.focus();
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("toggles once from the label and once from the control", async () => {
    const user = userEvent.setup();
    render(Example);
    const control = screen.getByRole("checkbox");
    await user.click(screen.getByText("Accept terms"));
    expect(control).toHaveAttribute("aria-checked", "true");
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "false");
  });
});
