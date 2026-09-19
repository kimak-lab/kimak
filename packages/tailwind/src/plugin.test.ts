import { compile } from "@tailwindcss/node";
import { buttonAnatomy } from "@kimak/spec";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const pluginPath = path.resolve(here, "index.ts");
const themeCssPath = path.resolve(here, "theme.css");

async function compilePluginCss(): Promise<string> {
  const { build } = await compile(
    `
      @import "tailwindcss";
      @import ${JSON.stringify(themeCssPath)};
      @plugin ${JSON.stringify(pluginPath)};
    `,
    {
      base: here,
      onDependency() {},
    },
  );

  return build(["bg-primary"]);
}

describe("@kimak/tailwind", () => {
  it("emits shadcn tokens, anatomy selectors, and visual state/size/variant", async () => {
    const css = await compilePluginCss();

    expect(css).toContain("--primary");
    expect(css).toContain("--radius");
    expect(css).toContain("--radius-md");
    expect(css).toContain(".bg-primary");
    expect(css).toContain("background-color: var(--primary)");
    expect(css).toContain(buttonAnatomy.root.selector);
    expect(css).toContain(buttonAnatomy.indicator.selector);
    expect(css).toContain('[data-loading]');
    expect(css).toContain("kimak-button-spin");
    expect(css).toContain('[data-variant="outline"]');
    expect(css).toContain('[data-size="sm"]');
  });
});
