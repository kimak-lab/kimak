import { createAnatomy } from "../anatomy";

export const popoverAnatomy = createAnatomy("popover", [
  "trigger",
  "positioner",
  "content",
  "title",
  "description",
  "close",
] as const);

export type PopoverPart = (typeof popoverAnatomy.parts)[number];
