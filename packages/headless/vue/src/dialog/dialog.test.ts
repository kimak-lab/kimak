import userEvent from "@testing-library/user-event";
import { mount } from "@vue/test-utils";
import { dialogSpec, type KeyCode } from "@kimak/spec";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it } from "vitest";
import { Dialog } from "./dialog";

function Example(props: { role?: "dialog" | "alertdialog"; defaultOpen?: boolean }) {
  return defineComponent({
    setup() {
      return () =>
        h(Dialog.Root, props, () => [
          h(Dialog.Trigger, { "data-testid": "open" }, () => "Open"),
          h(Dialog.Portal, () => [
            h(Dialog.Backdrop),
            h(Dialog.Positioner, () =>
              h(Dialog.Content, () => [
                h(Dialog.Title, () => "Edit profile"),
                h(Dialog.Description, () => "Make changes below."),
                h("button", { type: "button" }, "First"),
                h("button", { type: "button" }, "Last"),
                h(Dialog.Close, () => "Done"),
              ]),
            ),
          ]),
        ]);
    },
  });
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

const keyboardCases = {
  "Enter:trigger": async (user: ReturnType<typeof userEvent.setup>) => {
    const wrapper = mount(Example({}), { attachTo: document.body });
    (document.querySelector('[data-testid="open"]') as HTMLButtonElement).focus();
    await press(user, "Enter");
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    wrapper.unmount();
  },
  "Space:trigger": async (user: ReturnType<typeof userEvent.setup>) => {
    const wrapper = mount(Example({}), { attachTo: document.body });
    (document.querySelector('[data-testid="open"]') as HTMLButtonElement).focus();
    await press(user, "Space");
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    wrapper.unmount();
  },
  "Escape:content": async (user: ReturnType<typeof userEvent.setup>) => {
    const wrapper = mount(Example({}), { attachTo: document.body });
    await user.click(document.querySelector('[data-testid="open"]') as HTMLElement);
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    await press(user, "Escape");
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).toBeNull();
    });
    wrapper.unmount();
  },
  "Tab:content": async (user: ReturnType<typeof userEvent.setup>) => {
    const wrapper = mount(Example({ defaultOpen: true }), { attachTo: document.body });
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    const done = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent === "Done",
    );
    done?.focus();
    await press(user, "Tab");
    const first = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent === "First",
    );
    expect(first).toHaveFocus();
    wrapper.unmount();
  },
};

describe("Dialog", () => {
  it("opens from a trigger and exposes dialog anatomy", async () => {
    const user = userEvent.setup();
    const wrapper = mount(Example({}), { attachTo: document.body });
    const trigger = document.querySelector('[data-testid="open"]') as HTMLButtonElement;
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("data-slot", "trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    await user.click(trigger);
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).toHaveAttribute("data-scope", "dialog");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.querySelector('[data-slot="title"]')?.textContent).toBe("Edit profile");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    wrapper.unmount();
  });

  it("honors alertdialog role", async () => {
    const wrapper = mount(Example({ role: "alertdialog", defaultOpen: true }), {
      attachTo: document.body,
    });
    await waitFor(() => {
      expect(document.querySelector('[role="alertdialog"]')).not.toBeNull();
    });
    wrapper.unmount();
  });

  it("closes from the close trigger", async () => {
    const user = userEvent.setup();
    const wrapper = mount(Example({}), { attachTo: document.body });
    await user.click(document.querySelector('[data-testid="open"]') as HTMLElement);
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    const done = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent === "Done",
    );
    await user.click(done as HTMLElement);
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).toBeNull();
    });
    wrapper.unmount();
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
    const wrapper = mount(Example({}), { attachTo: document.body });
    const trigger = document.querySelector('[data-testid="open"]') as HTMLElement;
    await user.click(trigger);
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    await user.click(trigger);
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).toBeNull();
    });
    wrapper.unmount();
  });

  it("returns focus to the trigger on close", async () => {
    const user = userEvent.setup();
    const wrapper = mount(Example({}), { attachTo: document.body });
    const trigger = document.querySelector('[data-testid="open"]') as HTMLElement;
    await user.click(trigger);
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    const done = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent === "Done",
    );
    await user.click(done as HTMLElement);
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
    wrapper.unmount();
  });

  it("dismisses on interact outside", async () => {
    const user = userEvent.setup();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => [
            h("button", { type: "button" }, "outside"),
            h(Example({ defaultOpen: true })),
          ];
        },
      }),
      { attachTo: document.body },
    );
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    await user.click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "outside",
      ) as HTMLElement,
    );
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).toBeNull();
    });
    wrapper.unmount();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Dialog.Root, { disabled: true }, () => [
              h(Dialog.Trigger, { "data-testid": "open" }, () => "Open"),
              h(Dialog.Portal, () =>
                h(Dialog.Content, () => h(Dialog.Title, () => "Disabled")),
              ),
            ]);
        },
      }),
      { attachTo: document.body },
    );
    await user.click(document.querySelector('[data-testid="open"]') as HTMLElement);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    wrapper.unmount();
  });

  it("does not close on Escape when closeOnEscape is false", async () => {
    const user = userEvent.setup();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Dialog.Root, { defaultOpen: true, closeOnEscape: false }, () => [
              h(Dialog.Trigger, () => "Open"),
              h(Dialog.Portal, () =>
                h(Dialog.Content, () => h(Dialog.Title, () => "Stay open")),
              ),
            ]);
        },
      }),
      { attachTo: document.body },
    );
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    await user.keyboard("{Escape}");
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    wrapper.unmount();
  });

  it("skips scroll lock and aria-modal when not modal", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Dialog.Root, { defaultOpen: true, modal: false }, () => [
              h(Dialog.Trigger, () => "Open"),
              h(Dialog.Portal, () =>
                h(Dialog.Content, () => h(Dialog.Title, () => "Modeless")),
              ),
            ]);
        },
      }),
      { attachTo: document.body },
    );
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).not.toHaveAttribute("aria-modal");
    expect(document.body.style.overflow).not.toBe("hidden");
    wrapper.unmount();
  });

  it("keeps content mounted when forceMount is set", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Dialog.Root, { forceMount: true }, () => [
              h(Dialog.Trigger, () => "Open"),
              h(Dialog.Portal, () =>
                h(Dialog.Content, () => h(Dialog.Title, () => "Mounted")),
              ),
            ]);
        },
      }),
      { attachTo: document.body },
    );
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    });
    expect(document.querySelector('[role="dialog"]')).toHaveAttribute("data-state", "closed");
    wrapper.unmount();
  });

  it("nested dialog: Escape and inside clicks stay on the top layer", async () => {
    const user = userEvent.setup();
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Dialog.Root, { defaultOpen: true }, () => [
              h(Dialog.Trigger, () => "Outer"),
              h(Dialog.Portal, () =>
                h(Dialog.Content, () => [
                  h(Dialog.Title, () => "Outer"),
                  h(Dialog.Root, () => [
                    h(Dialog.Trigger, () => "Inner"),
                    h(Dialog.Portal, () =>
                      h(Dialog.Content, () => [
                        h(Dialog.Title, () => "Inner"),
                        h("button", { type: "button" }, "Inner action"),
                      ]),
                    ),
                  ]),
                ]),
              ),
            ]);
        },
      }),
      { attachTo: document.body },
    );
    await waitFor(() => {
      expect(
        Array.from(document.querySelectorAll('[role="dialog"]')).some(
          (node) => node.querySelector('[data-slot="title"]')?.textContent === "Outer",
        ),
      ).toBe(true);
    });
    await user.click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "Inner",
      ) as HTMLElement,
    );
    await waitFor(() => {
      expect(
        Array.from(document.querySelectorAll('[role="dialog"]')).some(
          (node) => node.querySelector('[data-slot="title"]')?.textContent === "Inner",
        ),
      ).toBe(true);
    });
    await user.click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "Inner action",
      ) as HTMLElement,
    );
    expect(
      Array.from(document.querySelectorAll('[role="dialog"]')).some(
        (node) => node.querySelector('[data-slot="title"]')?.textContent === "Inner",
      ),
    ).toBe(true);
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        Array.from(document.querySelectorAll('[role="dialog"]')).some(
          (node) => node.querySelector('[data-slot="title"]')?.textContent === "Inner",
        ),
      ).toBe(false);
    });
    expect(
      Array.from(document.querySelectorAll('[role="dialog"]')).some(
        (node) => node.querySelector('[data-slot="title"]')?.textContent === "Outer",
      ),
    ).toBe(true);
    wrapper.unmount();
  });
});
