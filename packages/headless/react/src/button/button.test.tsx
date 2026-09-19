import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { buttonSpec, type KeyCode } from "@kimak/spec";
import { Button } from "./button";

function Example(props: {
  disabled?: boolean;
  loading?: boolean;
  focusableWhenDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  onPress?: () => void;
  name?: string;
  value?: string;
}) {
  return (
    <Button.Root {...props}>
      Save
      <Button.Indicator />
    </Button.Root>
  );
}

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
    render(<Example onPress={onPress} />);
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).toHaveAttribute("data-scope", "button");
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("type", "button");
    expect(root.querySelector('[data-slot="indicator"]')).not.toBeNull();
    await user.click(root);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("merges render onto the consumer button", () => {
    render(
      <Button.Root render={<button type="button" data-testid="custom" />}>
        Save
        <Button.Indicator />
      </Button.Root>,
    );
    const root = screen.getByTestId("custom");
    expect(root.tagName).toBe("BUTTON");
    expect(root).toHaveAttribute("data-scope", "button");
    expect(root).toHaveAttribute("data-slot", "root");
  });

  it("forwards data-size as a host attribute", () => {
    render(
      <Button.Root data-size="sm">
        Save
        <Button.Indicator />
      </Button.Root>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-size", "sm");
  });

  it("forwards consumer className onto root and indicator", () => {
    render(
      <Button.Root className="btn-save">
        Save
        <Button.Indicator className="btn-spin" />
      </Button.Root>,
    );
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).toHaveClass("btn-save");
    expect(root.querySelector('[data-slot="indicator"]')).toHaveClass("btn-spin");
  });

  it("does not fire onPress when disabled", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Example disabled onPress={onPress} />);
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
    render(<Example loading onPress={onPress} />);
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
    render(<Example onPress={onPress} />);
    screen.getByRole("button", { name: "Save" }).focus();
    await press(user, binding.code);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("submits the form when type is submit", async () => {
    const user = userEvent.setup();
    let submitted: FormData | undefined;
    render(
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          submitted = new FormData(event.currentTarget);
        }}
      >
        <input name="title" defaultValue="hello" />
        <Example type="submit" />
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(submitted?.get("title")).toBe("hello");
  });

  it("forwards a controlled loading flag", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [loading, setLoading] = useState(false);
      return (
        <Button.Root loading={loading} onPress={() => setLoading(true)}>
          Save
          <Button.Indicator />
        </Button.Root>
      );
    }
    render(<Controlled />);
    const root = screen.getByRole("button", { name: "Save" });
    expect(root).not.toHaveAttribute("data-loading");
    await user.click(root);
    expect(root).toHaveAttribute("data-loading");
    expect(root).not.toBeDisabled();
    expect(root).toHaveFocus();
  });

  it("stays focusable when disabled with focusableWhenDisabled", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Example disabled focusableWhenDisabled onPress={onPress} />);
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
    let submitted = false;
    render(
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          submitted = true;
        }}
      >
        <input name="title" defaultValue="hello" />
        <Example type="submit" loading />
      </form>,
    );
    const root = screen.getByRole("button", { name: "Save" });
    root.focus();
    await user.keyboard("{Enter}");
    expect(submitted).toBe(false);
  });
});
