import { compile } from "@tailwindcss/node";
import { buttonAnatomy, checkboxAnatomy, dialogAnatomy } from "@kimak/spec";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const pluginPath = path.resolve(here, "index.ts");

async function compilePluginCss(): Promise<string> {
  const { build } = await compile(
    `
      @import "tailwindcss";
      @plugin ${JSON.stringify(pluginPath)};
    `,
    {
      base: here,
      onDependency() {},
    },
  );

  return build([]);
}

describe("@kimak/tailwind", () => {
  it("emits anatomy selectors and visual state/size variants", async () => {
    const css = await compilePluginCss();

    expect(css).toContain("--color-kimak-accent");
    expect(css).toContain(buttonAnatomy.root.selector);
    expect(css).toContain(buttonAnatomy.indicator.selector);
    expect(css).toContain('[data-loading]');
    expect(css).toContain(checkboxAnatomy.root.selector);
    expect(css).toContain(checkboxAnatomy.control.selector);
    expect(css).toContain(checkboxAnatomy.indicator.selector);
    expect(css).toContain('[data-state="checked"]');
    expect(css).toContain('[data-state="indeterminate"]');
    expect(css).toContain(":empty::after");
    expect(css).toContain("data:image/svg+xml");
    expect(css).toContain('[data-size="sm"]');
    expect(css).toContain(dialogAnatomy.content.selector);
    expect(css).toContain(dialogAnatomy.trigger.selector);
    expect(css).toContain(dialogAnatomy.backdrop.selector);
    expect(css).toContain('[data-state="open"]');
  });
});
