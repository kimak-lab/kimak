import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { buttonSpec, type KeyCode } from "@kimak/spec";
import { describe, expect, it, vi } from "vitest";
import Example from "./example.svelte";
import FormExample from "./form-example.svelte";

async function press(user: ReturnType<typeof userEvent.setup>, code: KeyCode) {
  switch (code) {
    case "Space":
      await user.keyboard(" ");
      return;
    case "Enter":
      await user.keyboard("{Enter}");
      return;
    case "Escape":
      await user.keyboard("{Escape}");
      return;
    case "Tab":
      await user.keyboard("{Tab}");
      return;
    default: {
      const exhaustive: never = code;
      throw new Error(`Unhandled key ${exhaustive}`);
    }
  }
}

describe("Button", () => {
  it("exposes root anatomy and fires onPress on click", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(Example, { onPress });
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).toHaveAttribute("data-scope", "button");
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("type", "button");
    expect(root.querySelector('[data-slot="indicator"]')).not.toBeNull();
    await user.click(root);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("forwards data-size as a host attribute", () => {
    render(Example, { "data-size": "sm" });
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-size", "sm");
  });

  it("forwards consumer class onto root and indicator", () => {
    render(Example, { class: "btn-save" });
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).toHaveClass("btn-save");
    expect(root.querySelector('[data-slot="indicator"]')).toHaveClass("btn-spin");
  });

  it("does not fire onPress when disabled", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(Example, { disabled: true, onPress });
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).toBeDisabled();
    expect(root).toHaveAttribute("data-disabled");
    expect(root).toHaveAttribute("aria-disabled", "true");
    await user.click(root);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("does not fire onPress when loading", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(Example, { loading: true, onPress });
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).not.toBeDisabled();
    expect(root).toHaveAttribute("data-loading");
    expect(root).toHaveAttribute("aria-disabled", "true");
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root.querySelector('[data-slot="indicator"]')).toHaveAttribute("data-loading");
    await user.click(root);
    expect(onPress).not.toHaveBeenCalled();
  });

  it.each(buttonSpec.keyboard)("$code on $slot presses the button", async (binding) => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(Example, { onPress });
    screen.getByRole("button", { name: "Save" }).focus();
    await press(user, binding.code);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("stays focusable when disabled with focusableWhenDisabled", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(Example, { disabled: true, focusableWhenDisabled: true, onPress });
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).not.toBeDisabled();
    expect(root).toHaveAttribute("data-disabled");
    expect(root).toHaveAttribute("aria-disabled", "true");
    root.focus();
    expect(root).toHaveFocus();
    await user.click(root);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("does not submit the form when loading", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(FormExample, { loading: true, onSubmit });
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).not.toBeDisabled();
    root.focus();
    await user.keyboard("{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
