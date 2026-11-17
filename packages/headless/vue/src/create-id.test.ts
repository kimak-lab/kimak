import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { Popover } from "./popover";

const App = defineComponent({
  setup() {
    return () => [
      h(Popover.Root, null, () => h(Popover.Trigger, null, () => "Settings")),
      h(Button.Root, null, () => "Save"),
    ];
  },
});

function createApp(idPrefix: string) {
  const app = createSSRApp(App);
  app.config.idPrefix = idPrefix;
  return app;
}

const ids = (root: ParentNode) =>
  Array.from(root.querySelectorAll("[data-scope]")).map((node) => node.id);

describe("createKimakId", () => {
  it("keeps server ids on hydration without mismatch warnings", async () => {
    const html = await renderToString(createApp("s1"));
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const serverIds = ids(container);

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = createApp("s1");
    app.mount(container);

    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(ids(container)).toEqual(serverIds);
    expect(serverIds.every((id) => id.startsWith("kimak-s1-"))).toBe(true);
    expect(new Set(serverIds).size).toBe(serverIds.length);

    app.unmount();
    warn.mockRestore();
    error.mockRestore();
  });

  it("stays unique across apps through idPrefix", async () => {
    const first = document.createElement("div");
    first.innerHTML = await renderToString(createApp("s1"));
    const second = document.createElement("div");
    second.innerHTML = await renderToString(createApp("s2"));
    const all = [...ids(first), ...ids(second)];
    expect(new Set(all).size).toBe(all.length);
  });
});
