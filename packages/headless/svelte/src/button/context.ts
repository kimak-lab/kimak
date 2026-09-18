import type { ButtonApi } from "@kimak/core";
import type { SveltePropTypes } from "../normalize-props";

export type GetButtonApi = () => ButtonApi<SveltePropTypes>;

export const BUTTON_KEY = Symbol("kimak-button");
