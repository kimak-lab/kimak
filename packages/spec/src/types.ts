export type Direction = "ltr" | "rtl";

export type PartOwner = "machine" | "adapter";

export type KeyCode = "Space" | "Enter" | "Escape" | "Tab";

export interface CommonProps {
  /** Unique id used to generate part ids. */
  id?: string;
  /**
   * Text direction.
   * @default "ltr"
   */
  dir?: Direction;
}

export interface PartContract<TSlot extends string = string> {
  slot: TSlot;
  tag: string;
  role?: string;
  /** Defaults to `"machine"`. Adapter-owned parts are not emitted by `connect()`. */
  owner?: PartOwner;
  dataAttrs: readonly string[];
  dataStates?: readonly string[];
  ariaAttrs?: readonly string[];
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

export interface KeyBinding<TSlot extends string = string> {
  key: string;
  code: KeyCode;
  slot: TSlot;
  when: string;
  then: string;
  preventDefault?: boolean;
}

export interface ComponentSpec<
  TParts extends string = string,
  TProp extends string = string,
  TEvent extends string = string,
> {
  name: string;
  description: string;
  parts: Record<TParts, PartContract<TParts>>;
  props: Record<TProp, PropContract>;
  events: Record<TEvent, EventContract>;
  keyboard: readonly KeyBinding<TParts>[];
  aria: readonly string[];
  presence?: {
    parts: readonly TParts[];
    forceMount: boolean;
  };
}
