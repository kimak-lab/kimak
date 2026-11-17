import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { popoverSpec, type KeyCode } from "@kimak/spec";
import { Popover, type PopoverRootProps } from "./popover";

function Example(props: Omit<PopoverRootProps, "children"> & { withTitle?: boolean }) {
  const { withTitle = true, ...rootProps } = props;
  return (
    <>
      <Popover.Root {...rootProps}>
        <Popover.Trigger>Settings</Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            {withTitle ? <Popover.Title>Display</Popover.Title> : null}
            <Popover.Description>Pick a density.</Popover.Description>
            <button type="button">Compact</button>
            <Popover.Close>Done</Popover.Close>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
      <button type="button">Outside</button>
    </>
  );
}

type User = ReturnType<typeof userEvent.setup>;

async function press(user: User, code: KeyCode) {
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

const trigger = () => screen.getByRole("button", { name: "Settings" });
const dialog = () => screen.queryByRole("dialog");

describe("Popover", () => {
  it("does not mount content while closed", () => {
    render(<Example />);
    expect(trigger()).toHaveAttribute("data-scope", "popover");
    expect(trigger()).toHaveAttribute("data-slot", "trigger");
    expect(trigger()).toHaveAttribute("data-state", "closed");
    expect(trigger()).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).not.toHaveAttribute("aria-controls");
    expect(dialog()).toBeNull();
  });

  it("opens on click, wires aria, and moves focus into content", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());

    const content = screen.getByRole("dialog", { name: "Display" });
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).toHaveAttribute("data-side", "bottom");
    expect(content).toHaveAccessibleDescription("Pick a density.");
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(trigger()).toHaveAttribute("aria-controls", content.id);
    expect(trigger()).toHaveAttribute("data-state", "open");
    expect(screen.getByRole("button", { name: "Compact" })).toHaveFocus();

    const positioner = content.parentElement;
    expect(positioner).toHaveAttribute("data-slot", "positioner");
    expect(positioner?.style.position).toBe("fixed");
  });

  it("omits aria-labelledby when no title is rendered", async () => {
    const user = userEvent.setup();
    render(<Example withTitle={false} />);
    await user.click(trigger());
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
  });

  it.each(popoverSpec.keyboard)("$code on $slot: $then", async (binding) => {
    const user = userEvent.setup();
    render(<Example />);

    switch (binding.code) {
      case "Enter":
      case "Space": {
        trigger().focus();
        await press(user, binding.code);
        expect(dialog()).not.toBeNull();
        trigger().focus();
        await press(user, binding.code);
        expect(dialog()).toBeNull();
        return;
      }
      case "Escape": {
        await user.click(trigger());
        expect(dialog()).not.toBeNull();
        await press(user, binding.code);
        expect(dialog()).toBeNull();
        expect(trigger()).toHaveFocus();
        return;
      }
      case "Tab": {
        await user.click(trigger());
        screen.getByRole("button", { name: "Done" }).focus();
        await press(user, binding.code);
        expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
        expect(dialog()).toBeNull();
        return;
      }
      default: {
        const exhaustive: never = binding;
        throw new Error(`Unhandled binding ${String(exhaustive)}`);
      }
    }
  });

  it("closes on pointer down outside without stealing focus back", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(dialog()).toBeNull();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });

  it("stays open on outside interaction when closeOnInteractOutside is false", async () => {
    const user = userEvent.setup();
    render(<Example closeOnInteractOutside={false} />);
    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(dialog()).not.toBeNull();
  });

  it("closes from Popover.Close and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(dialog()).toBeNull();
    expect(trigger()).toHaveFocus();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it("follows a controlled open prop", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <span data-testid="state">{open ? "open" : "closed"}</span>
          <Example open={open} onOpenChange={setOpen} />
        </>
      );
    }
    render(<Controlled />);
    await user.click(trigger());
    expect(screen.getByTestId("state")).toHaveTextContent("open");
    expect(dialog()).not.toBeNull();
    await user.keyboard("{Escape}");
    expect(screen.getByTestId("state")).toHaveTextContent("closed");
    expect(dialog()).toBeNull();
  });

  it("merges render onto the trigger", () => {
    render(
      <Popover.Root>
        <Popover.Trigger render={<button type="button" data-testid="custom" />}>Open</Popover.Trigger>
      </Popover.Root>,
    );
    const custom = screen.getByTestId("custom");
    expect(custom).toHaveAttribute("data-slot", "trigger");
    expect(custom).toHaveAttribute("aria-haspopup", "dialog");
  });
});
