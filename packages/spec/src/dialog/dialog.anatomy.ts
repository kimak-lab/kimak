import { createAnatomy } from "../anatomy";

export const dialogAnatomy = createAnatomy("dialog", [
  "root",
  "trigger",
  "portal",
  "backdrop",
  "positioner",
  "content",
  "title",
  "description",
  "close",
] as const);

export type DialogPart = (typeof dialogAnatomy.parts)[number];
