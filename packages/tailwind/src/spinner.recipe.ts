// Deep import: jiti's plugin loader drops named re-exports from the @kimak/spec barrel.
import { spinnerAnatomy } from "../../spec/src/spinner/spinner.anatomy";
import { spinnerGlyph } from "./spin";
import type { CssInJs } from "./types";

export function spinnerRecipe(): CssInJs {
  const root = spinnerAnatomy.root.selector;
  return {
    [root]: spinnerGlyph({ width: "1rem", height: "1rem" }),
  };
}
