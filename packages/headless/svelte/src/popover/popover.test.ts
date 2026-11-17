import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { popoverSpec, type KeyCode } from "@kimak/spec";
import { describe, expect, it, vi } from "vitest";
import AsExample from "./as-example.svelte";
import ControlledExample from "./controlled-example.svelte";
import Example from "./example.svelte";

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

/** `trackPopover` starts a tick after the content mounts. */
async function opened(user: User) {
  await user.click(trigger());
  await waitFor(() => expect(screen.getByRole("button", { name: "Compact" })).toHaveFocus());
}

describe("Popover", () => {
  it("does not mount content while closed", () => {
    render(Example);
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
    render(Example);
    await opened(user);

    const content = await screen.findByRole("dialog", { name: "Display" });
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).toHaveAttribute("data-side", "bottom");
    expect(content).toHaveAccessibleDescription("Pick a density.");
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(trigger()).toHaveAttribute("aria-controls", content.id);
    expect(trigger()).toHaveAttribute("data-state", "open");

    const positioner = content.parentElement;
    expect(positioner).toHaveAttribute("data-slot", "positioner");
    expect(positioner?.style.position).toBe("fixed");
  });

  it("omits aria-labelledby when no title is rendered", async () => {
    const user = userEvent.setup();
    render(Example, { withTitle: false });
    await opened(user);
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
  });

  it.each(popoverSpec.keyboard)("$code on $slot: $then", async (binding) => {
    const user = userEvent.setup();
    render(Example);

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
        await opened(user);
        await press(user, binding.code);
        expect(dialog()).toBeNull();
        expect(trigger()).toHaveFocus();
        return;
      }
      case "Tab": {
        await opened(user);
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
    render(Example);
    await opened(user);
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(dialog()).toBeNull();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });

  it("stays open on outside interaction when closeOnInteractOutside is false", async () => {
    const user = userEvent.setup();
    render(Example, { closeOnInteractOutside: false });
    await opened(user);
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(dialog()).not.toBeNull();
  });

  it("closes from Popover.Close and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(Example, { onOpenChange });
    await opened(user);
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(dialog()).toBeNull();
    expect(trigger()).toHaveFocus();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it("follows a controlled bind:open", async () => {
    const user = userEvent.setup();
    render(ControlledExample);
    await opened(user);
    expect(screen.getByTestId("state")).toHaveTextContent("open");
    expect(dialog()).not.toBeNull();
    await user.keyboard("{Escape}");
    expect(screen.getByTestId("state")).toHaveTextContent("closed");
    expect(dialog()).toBeNull();
  });

  it("renders the trigger as another tag through as", () => {
    render(AsExample);
    const custom = screen.getByTestId("custom");
    expect(custom.tagName).toBe("SPAN");
    expect(custom).toHaveAttribute("data-slot", "trigger");
    expect(custom).toHaveAttribute("aria-haspopup", "dialog");
  });
});
