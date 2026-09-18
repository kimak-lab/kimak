import { createAnatomy } from "../anatomy";

export const buttonAnatomy = createAnatomy("button", ["root", "indicator"] as const);

export type ButtonPart = (typeof buttonAnatomy.parts)[number];
