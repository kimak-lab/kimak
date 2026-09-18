import { createAnatomy } from "../anatomy";

export const checkboxAnatomy = createAnatomy("checkbox", [
  "root",
  "label",
  "control",
  "indicator",
  "hiddenInput",
] as const);

export type CheckboxPart = (typeof checkboxAnatomy.parts)[number];
