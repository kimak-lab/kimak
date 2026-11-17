import {
  connectPopover,
  createPopoverMachine,
  shouldMount,
  trackPopover,
  type Direction,
  type PopoverAlign,
  type PopoverApi,
  type PopoverProps as CorePopoverProps,
  type PopoverService,
  type PopoverSide,
} from "@kimak/core";
import {
  defineComponent,
  h,
  inject,
  provide,
  watch,
  type InjectionKey,
  type PropType,
  type VNode,
} from "vue";
import { createKimakId } from "../create-id";
import { useDirection } from "../direction";
import { mergeProps } from "../merge-props";
import { normalizeProps, type VuePropTypes } from "../normalize-props";
import { useMachine } from "../use-machine";

type VuePopoverApi = PopoverApi<VuePropTypes>;

interface PopoverContextValue {
  getApi: () => VuePopoverApi;
  service: PopoverService;
}

const PopoverKey: InjectionKey<PopoverContextValue> = Symbol("kimak-popover");

function usePopoverContext(): PopoverContextValue {
  const value = inject(PopoverKey, null);
  if (!value) {
    throw new Error("[kimak] Popover parts must be wrapped in Popover.Root");
  }
  return value;
}

/**
 * Read the popover api from inside `Popover.Root` (e.g. to close from custom
 * content). Returns a getter so reads stay reactive in render functions.
 */
export function usePopover(): () => VuePopoverApi {
  return usePopoverContext().getApi;
}

const optionalBoolean = {
  type: Boolean as PropType<boolean | undefined>,
  default: undefined,
} as const;

const asProp = String as PropType<string | undefined>;

export const PopoverRoot = defineComponent({
  name: "KimakPopoverRoot",
  inheritAttrs: false,
  props: {
    id: String,
    ids: Object as PropType<CorePopoverProps["ids"]>,
    open: optionalBoolean,
    defaultOpen: optionalBoolean,
    side: String as PropType<PopoverSide>,
    align: String as PropType<PopoverAlign>,
    sideOffset: Number,
    collisionPadding: Number,
    closeOnEscape: optionalBoolean,
    closeOnInteractOutside: optionalBoolean,
    dir: String as PropType<Direction>,
    onOpenChange: Function as PropType<CorePopoverProps["onOpenChange"]>,
    getRootNode: Function as PropType<CorePopoverProps["getRootNode"]>,
  },
  emits: {
    "update:open": (_open: boolean) => true,
  },
  setup(props, { slots, emit }) {
    const uid = createKimakId();
    const inheritedDir = useDirection();
    const service = useMachine(createPopoverMachine, () => ({
      id: props.id ?? uid,
      ids: props.ids,
      open: props.open,
      defaultOpen: props.defaultOpen,
      side: props.side,
      align: props.align,
      sideOffset: props.sideOffset,
      collisionPadding: props.collisionPadding,
      closeOnEscape: props.closeOnEscape,
      closeOnInteractOutside: props.closeOnInteractOutside,
      dir: props.dir ?? inheritedDir,
      getRootNode: props.getRootNode,
      onOpenChange: (open: boolean) => {
        emit("update:open", open);
        props.onOpenChange?.(open);
      },
    }));

    const getApi = () => connectPopover(service, normalizeProps);
    provide(PopoverKey, { getApi, service });

    return (): VNode[] | undefined => slots.default?.();
  },
});

export const PopoverTrigger = defineComponent({
  name: "KimakPopoverTrigger",
  inheritAttrs: false,
  props: { as: asProp },
  setup(props, { slots, attrs }) {
    const { getApi } = usePopoverContext();
    return (): VNode =>
      h(props.as ?? "button", mergeProps(getApi().getTriggerProps(), attrs), slots.default?.());
  },
});

export const PopoverPositioner = defineComponent({
  name: "KimakPopoverPositioner",
  inheritAttrs: false,
  props: {
    as: asProp,
    /** Keep the positioner and content mounted while closed. */
    forceMount: Boolean,
  },
  setup(props, { slots, attrs }) {
    const { getApi, service } = usePopoverContext();

    // `post` flush runs after the DOM patch, so trigger / positioner / content
    // function refs are set before `trackPopover` reads them.
    watch(
      () => getApi().open,
      (open, _prev, onCleanup) => {
        if (!open) return;
        onCleanup(trackPopover(service));
      },
      { flush: "post", immediate: true },
    );

    return (): VNode | null => {
      const api = getApi();
      if (!shouldMount({ present: api.open, forceMount: props.forceMount })) return null;
      return h(props.as ?? "div", mergeProps(api.getPositionerProps(), attrs), slots.default?.());
    };
  },
});

export const PopoverContent = defineComponent({
  name: "KimakPopoverContent",
  inheritAttrs: false,
  props: {
    as: asProp,
    /** Keep the content mounted while closed. */
    forceMount: Boolean,
  },
  setup(props, { slots, attrs }) {
    const { getApi } = usePopoverContext();
    return (): VNode | null => {
      const api = getApi();
      if (!shouldMount({ present: api.open, forceMount: props.forceMount })) return null;
      return h(props.as ?? "div", mergeProps(api.getContentProps(), attrs), slots.default?.());
    };
  },
});

export const PopoverTitle = defineComponent({
  name: "KimakPopoverTitle",
  inheritAttrs: false,
  props: { as: asProp },
  setup(props, { slots, attrs }) {
    const { getApi } = usePopoverContext();
    return (): VNode =>
      h(props.as ?? "h2", mergeProps(getApi().getTitleProps(), attrs), slots.default?.());
  },
});

export const PopoverDescription = defineComponent({
  name: "KimakPopoverDescription",
  inheritAttrs: false,
  props: { as: asProp },
  setup(props, { slots, attrs }) {
    const { getApi } = usePopoverContext();
    return (): VNode =>
      h(props.as ?? "p", mergeProps(getApi().getDescriptionProps(), attrs), slots.default?.());
  },
});

export const PopoverClose = defineComponent({
  name: "KimakPopoverClose",
  inheritAttrs: false,
  props: { as: asProp },
  setup(props, { slots, attrs }) {
    const { getApi } = usePopoverContext();
    return (): VNode =>
      h(props.as ?? "button", mergeProps(getApi().getCloseProps(), attrs), slots.default?.());
  },
});

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Positioner: PopoverPositioner,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
};

export interface PopoverRootProps extends CorePopoverProps {}

export interface PopoverPartProps {
  /** Host tag. Adapter-local composition, not a portable contract. */
  as?: string;
}

export interface PopoverPresenceProps extends PopoverPartProps {
  forceMount?: boolean;
}

export type PopoverTriggerProps = PopoverPartProps;
export type PopoverPositionerProps = PopoverPresenceProps;
export type PopoverContentProps = PopoverPresenceProps;
export type PopoverTitleProps = PopoverPartProps;
export type PopoverDescriptionProps = PopoverPartProps;
export type PopoverCloseProps = PopoverPartProps;
