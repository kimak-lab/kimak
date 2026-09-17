import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { dialogSpec, type KeyCode } from "@kimak/spec";
import { Dialog } from "./dialog";

function Example(props: { role?: "dialog" | "alertdialog"; defaultOpen?: boolean }) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger render={<button type="button" data-testid="open" />}>
        Open
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>Make changes below.</Dialog.Description>
            <button type="button">First</button>
            <button type="button">Last</button>
            <Dialog.Close>Done</Dialog.Close>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
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

const keyboardCases = {
  "Enter:trigger": async (user: ReturnType<typeof userEvent.setup>) => {
    render(<Example />);
    screen.getByTestId("open").focus();
    await press(user, "Enter");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  },
  "Space:trigger": async (user: ReturnType<typeof userEvent.setup>) => {
    render(<Example />);
    screen.getByTestId("open").focus();
    await press(user, "Space");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  },
  "Escape:content": async (user: ReturnType<typeof userEvent.setup>) => {
    render(<Example />);
    await user.click(screen.getByTestId("open"));
    await screen.findByRole("dialog");
    await press(user, "Escape");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
  "Tab:content": async (user: ReturnType<typeof userEvent.setup>) => {
    render(<Example defaultOpen />);
    await screen.findByRole("dialog");
    screen.getByRole("button", { name: "Done" }).focus();
    await press(user, "Tab");
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
  },
};

describe("Dialog", () => {
  it("opens from a render trigger and exposes dialog anatomy", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByTestId("open");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("data-slot", "trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("data-scope", "dialog");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Edit profile")).toHaveAttribute("data-slot", "title");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("honors alertdialog role", async () => {
    render(<Example role="alertdialog" defaultOpen />);
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
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

  it.each(dialogSpec.keyboard)("$code on $slot", async (binding) => {
    const user = userEvent.setup();
    const key = `${binding.code}:${binding.slot}` as keyof typeof keyboardCases;
    const run = keyboardCases[key];
    if (typeof run !== "function") {
      throw new Error(`missing keyboard case ${binding.code}:${binding.slot}`);
    }
    await run(user);
  });
});
