export interface PresenceState {
  present: boolean;
  forceMount?: boolean;
}

export function shouldMount({ present, forceMount }: PresenceState): boolean {
  return Boolean(forceMount || present);
}

export function getPresenceState(present: boolean): "open" | "closed" {
  return present ? "open" : "closed";
}
