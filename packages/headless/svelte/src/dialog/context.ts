import type { DialogApi } from "@kimak/core";
import type { SveltePropTypes } from "../normalize-props";

export type GetDialogApi = () => DialogApi<SveltePropTypes>;

export interface DialogContextValue {
  getApi: GetDialogApi;
  getForceMount: () => boolean;
}

export const DIALOG_KEY = Symbol("kimak-dialog");
