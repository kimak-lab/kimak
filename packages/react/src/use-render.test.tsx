import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mergeProps } from "./merge-props";
import { Primitive } from "./primitive";

describe("render / mergeProps", () => {
  it("forwards trigger props onto a consumer button without an extra wrapper", async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    render(
      <Primitive.button
        render={<button type="button" data-testid="host" onClick={() => order.push("consumer")} />}
        data-slot="trigger"
        onClick={() => order.push("library")}
      >
        Open
      </Primitive.button>,
    );
    const host = screen.getByTestId("host");
    expect(host).toHaveAttribute("data-slot", "trigger");
    expect(host).toHaveTextContent("Open");
    expect(document.querySelectorAll("button")).toHaveLength(1);
    await user.click(host);
    expect(order).toEqual(["library", "consumer"]);
  });

  it("lets a render function own the DOM node", () => {
    render(
      <Primitive.button
        data-slot="trigger"
        render={(props) => <a {...props} data-testid="link" href="/open" />}
      >
        Open
      </Primitive.button>,
    );
    const host = screen.getByTestId("link");
    expect(host.tagName).toBe("A");
    expect(host).toHaveAttribute("data-slot", "trigger");
    expect(host).toHaveTextContent("Open");
  });

  it("composes refs and className", () => {
    const merged = mergeProps(
      { className: "a", ref: () => undefined },
      { className: "b" },
    );
    expect(merged.className).toBe("a b");
  });
});
