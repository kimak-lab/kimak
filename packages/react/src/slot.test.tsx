import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mergeProps } from "./merge-props";
import { Primitive } from "./primitive";

describe("asChild / mergeProps", () => {
  it("forwards trigger props onto a consumer button without an extra wrapper", async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    render(
      <Primitive.button
        asChild
        data-slot="trigger"
        onClick={() => order.push("library")}
      >
        <button type="button" data-testid="host" onClick={() => order.push("consumer")}>
          Open
        </button>
      </Primitive.button>,
    );
    const host = screen.getByTestId("host");
    expect(host).toHaveAttribute("data-slot", "trigger");
    expect(document.querySelectorAll("button")).toHaveLength(1);
    await user.click(host);
    expect(order).toEqual(["library", "consumer"]);
  });

  it("composes refs and className", () => {
    const merged = mergeProps(
      { className: "a", ref: () => undefined },
      { className: "b" },
    );
    expect(merged.className).toBe("a b");
  });
});
