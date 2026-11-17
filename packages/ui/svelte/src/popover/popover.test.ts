import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { popoverContentAttrs } from "./index";
import Fixture from "./popover.fixture.test.svelte";

describe("Popover sugar", () => {
  it("portals positioner and content to document.body", async () => {
    const user = userEvent.setup();
    render(Fixture);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const content = screen.getByRole("dialog");
    await waitFor(() => expect(content).toHaveAccessibleName("Library"));
    expect(screen.getByTestId("host").contains(content)).toBe(false);
    const positioner = content.parentElement;
    expect(positioner).toHaveAttribute("data-slot", "positioner");
    // Svelte portal host is a `display: contents` wrapper appended to body.
    expect(positioner?.parentElement?.parentElement).toBe(document.body);
  });

  it("renders inline when portalled is false and closes through usePopover", async () => {
    const user = userEvent.setup();
    render(Fixture, { portalled: false });
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByTestId("host").contains(screen.getByRole("dialog"))).toBe(true);
    await waitFor(() => expect(screen.getByRole("button", { name: "Tabler" })).toHaveFocus());
    await user.click(screen.getByRole("button", { name: "Tabler" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });

  it("exposes look-only content attrs", () => {
    expect(popoverContentAttrs()).toEqual({ "data-scope": "popover", "data-slot": "content" });
  });
});
