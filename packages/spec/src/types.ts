export type Direction = "ltr" | "rtl";

export interface PartContract {
  slot: string;
  tag: string;
  role?: string;
  dataAttrs: readonly string[];
}

export interface PropContract {
  type: string;
  description: string;
  default?: string;
  controlled?: boolean;
}

export interface EventContract {
  payload: string;
  description: string;
}

export interface KeyBinding {
  key: string;
  when: string;
  then: string;
  preventDefault?: boolean;
}

export interface ComponentSpec<TParts extends string = string> {
  name: string;
  description: string;
  parts: Record<TParts, PartContract>;
  props: Record<string, PropContract>;
  events: Record<string, EventContract>;
  keyboard: readonly KeyBinding[];
  aria: readonly string[];
  presence?: {
    parts: readonly TParts[];
    forceMount: boolean;
  };
}
