import { createAnatomy } from "../anatomy";

export const spinnerAnatomy = createAnatomy("spinner", ["root"] as const);

export type SpinnerPart = (typeof spinnerAnatomy.parts)[number];
