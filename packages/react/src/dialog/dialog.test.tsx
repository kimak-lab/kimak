import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Dialog } from "./dialog";

function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" data-testid="open">
          Open
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>Make changes below.</Dialog.Description>
            <Dialog.Close>Done</Dialog.Close>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

describe("Dialog", () => {
  it("opens from an asChild trigger and exposes dialog anatomy", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByTestId("open");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("data-slot", "trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("data-scope", "dialog");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Edit profile")).toHaveAttribute("data-slot", "title");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByTestId("open"));
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes from the close trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByTestId("open"));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
