import { shouldMount } from "@kimak/core";

export interface PresenceProps {
  present: boolean;
  forceMount?: boolean;
}

export function shouldRenderPresence(props: PresenceProps): boolean {
  return shouldMount({ present: props.present, forceMount: props.forceMount });
}

// Full Presence component lands with Dialog port.
export const presenceStub = true;
