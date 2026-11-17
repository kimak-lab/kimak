import {
  Popover as Parts,
  Portal,
  type PopoverPositionerProps,
} from "@kimak/headless-vue";
import { defineComponent, h, type PropType, type VNode } from "vue";

export interface PopoverContentProps {
  /**
   * Render into a portal so the content escapes clipping ancestors.
   * @default true
   */
  portalled?: boolean;
  /** Portal target. Defaults to `document.body`. */
  container?: HTMLElement | null;
  /** Props forwarded to the positioner wrapper. */
  positionerProps?: Omit<PopoverPositionerProps, "forceMount"> & Record<string, unknown>;
  /** Keep the positioner and content mounted while closed. */
  forceMount?: boolean;
  /** Content host tag. */
  as?: string;
}

/** Portal + Positioner + Content in one part. */
const Content = defineComponent({
  name: "KimakPopoverContentSugar",
  inheritAttrs: false,
  props: {
    portalled: { type: Boolean, default: true },
    container: { type: Object as PropType<HTMLElement | null>, default: null },
    positionerProps: Object as PropType<PopoverContentProps["positionerProps"]>,
    forceMount: Boolean,
    as: String,
  },
  setup(props, { slots, attrs }) {
    return (): VNode => {
      const tree = h(
        Parts.Positioner,
        { ...props.positionerProps, forceMount: props.forceMount },
        () => h(Parts.Content, { ...attrs, as: props.as, forceMount: props.forceMount }, slots),
      );
      return props.portalled ? h(Portal, { container: props.container }, () => tree) : tree;
    };
  },
});

export const Popover = Object.assign(Parts.Root, {
  Root: Parts.Root,
  Trigger: Parts.Trigger,
  Content,
  Title: Parts.Title,
  Description: Parts.Description,
  Close: Parts.Close,
});

export type {
  PopoverCloseProps,
  PopoverDescriptionProps,
  PopoverRootProps as PopoverProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from "@kimak/headless-vue";
