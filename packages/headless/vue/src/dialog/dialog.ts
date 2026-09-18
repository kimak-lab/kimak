import {
  addDismissLayer,
  connectDialog,
  createDialogMachine,
  focusFirst,
  getOwnerDocument,
  handleEscapeKey,
  handleInteractOutside,
  lockScroll,
  type DialogApi,
  type DialogProps as CoreDialogProps,
  type Direction,
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
import { Portal as KimakPortal } from "../portal";
import { Presence } from "../presence";
import { useMachine } from "../use-machine";

type VueDialogApi = DialogApi<VuePropTypes>;

interface DialogContextValue {
  getApi: () => VueDialogApi;
  getForceMount: () => boolean;
}

const DialogKey: InjectionKey<DialogContextValue> = Symbol("kimak-dialog");

function useDialogContext(): DialogContextValue {
  const value = inject(DialogKey);
  if (!value) {
    throw new Error("[kimak] Dialog parts must be wrapped in Dialog.Root");
  }
  return value;
}

const optionalBoolean = { type: Boolean as PropType<boolean | undefined>, default: undefined };

export const DialogRoot = defineComponent({
  name: "KimakDialogRoot",
  inheritAttrs: false,
  props: {
    id: String,
    open: optionalBoolean,
    defaultOpen: optionalBoolean,
    modal: optionalBoolean,
    closeOnEscape: optionalBoolean,
    closeOnInteractOutside: optionalBoolean,
    forceMount: optionalBoolean,
    disabled: optionalBoolean,
    role: String as PropType<CoreDialogProps["role"]>,
    dir: String as PropType<Direction>,
    ids: Object as PropType<CoreDialogProps["ids"]>,
    onOpenChange: Function as PropType<CoreDialogProps["onOpenChange"]>,
    getRootNode: Function as PropType<CoreDialogProps["getRootNode"]>,
  },
  setup(props, { slots, attrs }) {
    const uid = createKimakId();
    const inheritedDir = useDirection();
    const service = useMachine(createDialogMachine, () => ({
      id: props.id ?? uid,
      open: props.open,
      defaultOpen: props.defaultOpen,
      modal: props.modal,
      closeOnEscape: props.closeOnEscape,
      closeOnInteractOutside: props.closeOnInteractOutside,
      forceMount: props.forceMount,
      disabled: props.disabled,
      role: props.role,
      dir: props.dir ?? inheritedDir,
      ids: props.ids,
      onOpenChange: props.onOpenChange,
      getRootNode: props.getRootNode,
    }));

    const getApi = () => connectDialog(service, normalizeProps);
    provide(DialogKey, {
      getApi,
      getForceMount: () => Boolean(props.forceMount),
    });

    watch(
      () => getApi().open,
      (open, _prev, onCleanup) => {
        if (!open) return undefined;
        const layerId = String(props.id ?? uid);
        const doc = getOwnerDocument(props.getRootNode);
        const removeLayer = addDismissLayer({
          id: layerId,
          closeOnEscape: props.closeOnEscape,
          closeOnInteractOutside: props.closeOnInteractOutside,
          onDismiss: () => service.send({ type: "CLOSE" }),
        });
        const onKeyDown = (event: KeyboardEvent) => {
          handleEscapeKey(event);
        };
        const onPointerDown = (event: PointerEvent) => {
          handleInteractOutside(event, {
            id: layerId,
            content: service.refs.content ?? null,
            exclude: [service.refs.trigger],
          });
        };
        doc.addEventListener("keydown", onKeyDown);
        doc.addEventListener("pointerdown", onPointerDown);
        const unlock = props.modal !== false ? lockScroll(doc) : () => undefined;
        onCleanup(() => {
          removeLayer();
          doc.removeEventListener("keydown", onKeyDown);
          doc.removeEventListener("pointerdown", onPointerDown);
          unlock();
          const trigger = service.refs.trigger;
          if (trigger instanceof HTMLElement) trigger.focus();
        });
      },
      { immediate: true },
    );

    return (): VNode => {
      const merged = mergeProps(getApi().getRootProps(), attrs);
      return h("div", merged, slots.default?.());
    };
  },
});

export const DialogTrigger = defineComponent({
  name: "KimakDialogTrigger",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const { getApi } = useDialogContext();
    return (): VNode =>
      h("button", mergeProps(getApi().getTriggerProps(), attrs), slots.default?.());
  },
});

export const DialogPortal = defineComponent({
  name: "KimakDialogPortal",
  props: {
    container: { type: Object as PropType<HTMLElement | null>, default: null },
  },
  setup(props, { slots }) {
    const { getApi, getForceMount } = useDialogContext();
    return (): VNode =>
      h(Presence, { present: getApi().open, forceMount: getForceMount() }, () =>
        h(KimakPortal, { container: props.container }, () => slots.default?.()),
      );
  },
});

export const DialogBackdrop = defineComponent({
  name: "KimakDialogBackdrop",
  inheritAttrs: false,
  setup(_props, { attrs }) {
    const { getApi } = useDialogContext();
    return (): VNode => h("div", mergeProps(getApi().getBackdropProps(), attrs));
  },
});

export const DialogPositioner = defineComponent({
  name: "KimakDialogPositioner",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const { getApi } = useDialogContext();
    return (): VNode =>
      h("div", mergeProps(getApi().getPositionerProps(), attrs), slots.default?.());
  },
});

export const DialogContent = defineComponent({
  name: "KimakDialogContent",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const { getApi } = useDialogContext();

    watch(
      () => getApi().open,
      (open) => {
        if (!open) return;
        const merged = mergeProps(getApi().getContentProps(), attrs);
        const node = document.getElementById(String(merged.id ?? ""));
        if (!node) return;
        focusFirst(node);
      },
      { flush: "post", immediate: true },
    );

    return (): VNode =>
      h("div", mergeProps(getApi().getContentProps(), attrs), slots.default?.());
  },
});

export const DialogTitle = defineComponent({
  name: "KimakDialogTitle",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const { getApi } = useDialogContext();
    return (): VNode =>
      h("h2", mergeProps(getApi().getTitleProps(), attrs), slots.default?.());
  },
});

export const DialogDescription = defineComponent({
  name: "KimakDialogDescription",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const { getApi } = useDialogContext();
    return (): VNode =>
      h("p", mergeProps(getApi().getDescriptionProps(), attrs), slots.default?.());
  },
});

export const DialogClose = defineComponent({
  name: "KimakDialogClose",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    const { getApi } = useDialogContext();
    return (): VNode =>
      h("button", mergeProps(getApi().getCloseTriggerProps(), attrs), slots.default?.());
  },
});

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Backdrop: DialogBackdrop,
  Positioner: DialogPositioner,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

export type DialogRootProps = CoreDialogProps;
