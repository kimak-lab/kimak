import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Popover, popoverContentAttrs, usePopover } from "./index";

function Choice({ label }: { label: string }) {
  const popover = usePopover();
  return (
    <button type="button" onClick={() => popover.setOpen(false)}>
      {label}
    </button>
  );
}

describe("Popover sugar", () => {
  it("portals positioner and content to document.body", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Library</Popover.Title>
          <Choice label="Tabler" />
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const content = screen.getByRole("dialog", { name: "Library" });
    expect(container.contains(content)).toBe(false);
    expect(content.parentElement).toHaveAttribute("data-slot", "positioner");
    expect(content.parentElement?.parentElement).toBe(document.body);
  });

  it("renders inline when portalled is false and closes through usePopover", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content portalled={false}>
          <Choice label="Tabler" />
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(container.contains(screen.getByRole("dialog"))).toBe(true);
    await user.click(screen.getByRole("button", { name: "Tabler" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });

  it("exposes look-only content attrs", () => {
    expect(popoverContentAttrs()).toEqual({ "data-scope": "popover", "data-slot": "content" });
  });
});
