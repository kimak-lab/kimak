import { createAnatomy } from "../anatomy";

export const buttonGroupAnatomy = createAnatomy("button-group", ["root"] as const);

export type ButtonGroupPart = (typeof buttonGroupAnatomy.parts)[number];
