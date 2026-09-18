import type { CheckboxApi } from "@kimak/core";
import type { SveltePropTypes } from "../normalize-props";

export type GetCheckboxApi = () => CheckboxApi<SveltePropTypes>;

export const CHECKBOX_KEY = Symbol("kimak-checkbox");
