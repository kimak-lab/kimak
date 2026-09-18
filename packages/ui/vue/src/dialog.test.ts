import userEvent from "@testing-library/user-event";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it } from "vitest";
import { Dialog } from "./dialog";

async function waitFor(assert: () => void, attempts = 20) {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    await nextTick();
    try {
      assert();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
    }
  }
  throw lastError;
}

describe("Dialog sugar", () => {
  it("opens with Content wrapping portal, backdrop, and positioner", async () => {
    const user = userEvent.setup();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Dialog.Root, () => [
              h(Dialog.Trigger, () => "Open"),
              h(Dialog.Content, { "data-size": "md" }, () => [
                h(Dialog.Title, () => "Edit"),
                h(Dialog.Description, () => "Make a change."),
                h(Dialog.Close, () => "Done"),
              ]),
            ]);
        },
      }),
      { attachTo: document.body },
    );
    await user.click(wrapper.get("button").element);
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).toHaveAttribute("data-slot", "content");
    expect(dialog).toHaveAttribute("data-size", "md");
    wrapper.unmount();
  });
});
