import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Dialog } from "./dialog";

describe("Dialog sugar", () => {
  it("opens with Content wrapping portal, backdrop, and positioner", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger render={<button type="button" />}>Open</Dialog.Trigger>
        <Dialog.Content data-size="md">
          <Dialog.Title>Edit</Dialog.Title>
          <Dialog.Description>Make a change.</Dialog.Description>
          <Dialog.Close>Done</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("data-slot", "content");
    expect(dialog).toHaveAttribute("data-size", "md");
  });
});
