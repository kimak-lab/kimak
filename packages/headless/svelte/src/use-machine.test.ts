import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import CounterProbe from "./use-machine.test.svelte";

describe("useMachine", () => {
  it("updates when the machine sends", async () => {
    const view = render(CounterProbe, { count: 0 });
    expect(view.getByTestId("count")).toHaveTextContent("0");

    await view.getByTestId("increment").click();
    expect(view.getByTestId("count")).toHaveTextContent("1");
  });
});
