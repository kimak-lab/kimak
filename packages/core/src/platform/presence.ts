import type { DialogDataState } from "@kimak/spec";

export interface PresenceState {
  present: boolean;
  forceMount?: boolean;
}

export function shouldMount({ present, forceMount }: PresenceState): boolean {
  return Boolean(forceMount || present);
}

export function getPresenceState(present: boolean): DialogDataState {
  return present ? "open" : "closed";
}
