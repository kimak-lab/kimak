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

  it("closes from the trigger without reopening", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByTestId("open");
    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("returns focus to the trigger on close", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByTestId("open");
    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("dismisses on interact outside", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">outside</button>
        <Example defaultOpen />
      </>,
    );
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "outside" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root disabled>
        <Dialog.Trigger render={<button type="button" data-testid="open" />}>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Disabled</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByTestId("open"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not close on Escape when closeOnEscape is false", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root defaultOpen closeOnEscape={false}>
        <Dialog.Trigger render={<button type="button" />}>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Stay open</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("skips scroll lock and aria-modal when not modal", async () => {
    render(
      <Dialog.Root defaultOpen modal={false}>
        <Dialog.Trigger render={<button type="button" />}>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Modeless</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    const dialog = await screen.findByRole("dialog");
    expect(dialog).not.toHaveAttribute("aria-modal");
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("keeps content mounted when forceMount is set", async () => {
    render(
      <Dialog.Root forceMount>
        <Dialog.Trigger render={<button type="button" />}>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Mounted</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("data-state", "closed");
  });

  it("nested dialog: Escape and inside clicks stay on the top layer", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger render={<button type="button" />}>Outer</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Outer</Dialog.Title>
            <Dialog.Root>
              <Dialog.Trigger render={<button type="button" />}>Inner</Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Content>
                  <Dialog.Title>Inner</Dialog.Title>
                  <button type="button">Inner action</button>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await screen.findByRole("dialog", { name: "Outer" });
    await user.click(screen.getByRole("button", { name: "Inner" }));
    const inner = await screen.findByRole("dialog", { name: "Inner" });
    await user.click(screen.getByRole("button", { name: "Inner action" }));
    expect(inner).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Outer" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Inner" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("dialog", { name: "Outer" })).toBeInTheDocument();
  });
});
