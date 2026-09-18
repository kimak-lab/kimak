import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type FormEvent } from "react";
import { describe, expect, it } from "vitest";
import { checkboxSpec } from "@kimak/spec";
import { Checkbox } from "./checkbox";

function Example(props: {
  disabled?: boolean;
  readOnly?: boolean;
  defaultChecked?: boolean | "indeterminate";
  name?: string;
  value?: string;
}) {
  return (
    <Checkbox.Root {...props}>
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

  it("merges render onto the consumer label", () => {
    render(
      <Checkbox.Root render={<label data-testid="custom" />}>
        <Checkbox.Control />
        <Checkbox.HiddenInput />
      </Checkbox.Root>,
    );
    const root = screen.getByTestId("custom");
    expect(root.tagName).toBe("LABEL");
    expect(root).toHaveAttribute("data-scope", "checkbox");
    expect(root).toHaveAttribute("data-slot", "root");
  });

  it("exposes mixed as aria-checked=mixed", () => {
    render(<Example defaultChecked="indeterminate" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "indeterminate");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Example disabled />);
    const control = screen.getByRole("checkbox");
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("does not toggle when readOnly", async () => {
    const user = userEvent.setup();
    render(<Example readOnly />);
    const control = screen.getByRole("checkbox");
    control.focus();
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("Enter does not toggle the checkbox", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const control = screen.getByRole("checkbox");
    control.focus();
    await user.keyboard("{Enter}");
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it.each(checkboxSpec.keyboard)("$code on $slot toggles the checkbox", async (binding) => {
    expect(`${binding.code}:${binding.slot}`).toBe("Space:control");
    const user = userEvent.setup();
    render(<Example />);
    const control = screen.getByRole("checkbox");
    control.focus();
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("toggles once from the label and once from the control", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const control = screen.getByRole("checkbox");
    await user.click(screen.getByText("Accept terms"));
    expect(control).toHaveAttribute("aria-checked", "true");
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("submits the hidden input with the form when checked", async () => {
    const user = userEvent.setup();
    let submitted: FormData | undefined;
    render(
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          submitted = new FormData(event.currentTarget);
        }}
      >
        <Example name="terms" value="yes" />
        <button type="submit">Save</button>
      </form>,
    );
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(submitted?.get("terms")).toBe("yes");
  });

  it("syncs a controlled checked value", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox.Root checked={checked} onCheckedChange={(details) => setChecked(details.checked === true)}>
          <Checkbox.Control />
          <Checkbox.Label>Controlled</Checkbox.Label>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      );
    }
    render(<Controlled />);
    const control = screen.getByRole("checkbox");
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");
  });
});
