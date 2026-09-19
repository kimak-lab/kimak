export interface PresenceState {
  present: boolean;
  forceMount?: boolean;
}

export type PresenceDataState = "open" | "closed";

export function shouldMount({ present, forceMount }: PresenceState): boolean {
  return Boolean(forceMount || present);
}

export function getPresenceState(present: boolean): PresenceDataState {
  return present ? "open" : "closed";
}
