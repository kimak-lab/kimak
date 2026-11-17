import type { PopoverApi, PopoverService } from "@kimak/core";
import { getContext } from "svelte";
import type { SveltePropTypes } from "../normalize-props";

export type SveltePopoverApi = PopoverApi<SveltePropTypes>;

export interface PopoverContextValue {
  getApi: () => SveltePopoverApi;
  service: PopoverService;
}

export const POPOVER_KEY = Symbol("kimak-popover");

export function usePopoverContext(): PopoverContextValue {
  const value = getContext<PopoverContextValue | undefined>(POPOVER_KEY);
  if (!value) {
    throw new Error("[kimak] Popover parts must be wrapped in Popover.Root");
  }
  return value;
}

/**
 * Read the popover api from inside `Popover.Root` (e.g. to close from custom
 * content). Returns a getter so reads stay reactive inside `$derived` / markup.
 */
export function usePopover(): () => SveltePopoverApi {
  return usePopoverContext().getApi;
}
