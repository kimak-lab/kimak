import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner, spinnerAttrs } from "./index";

describe("Spinner", () => {
  it("emits spinner anatomy and merges className", () => {
    const { container } = render(<Spinner className="spin-save" />);
    const root = container.querySelector("[data-scope='spinner']");
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute("data-slot", "root");
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("spin-save");
  });
});

describe("spinnerAttrs", () => {
  it("emits anatomy selectors", () => {
    expect(spinnerAttrs()).toEqual({
      "data-scope": "spinner",
      "data-slot": "root",
    });
  });
});
