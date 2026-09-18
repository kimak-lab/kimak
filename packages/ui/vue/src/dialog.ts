import { Dialog as Parts } from "@kimak/headless-vue";
import { defineComponent, h, type PropType, type VNode } from "vue";

const Content = defineComponent({
  name: "KimakDialogContent",
  inheritAttrs: false,
  props: {
    container: { type: Object as PropType<HTMLElement | null>, default: null },
  },
  setup(props, { slots, attrs }) {
    return (): VNode =>
      h(Parts.Portal, { container: props.container }, () => [
        h(Parts.Backdrop),
        h(Parts.Positioner, () => h(Parts.Content, attrs, () => slots.default?.())),
      ]);
  },
});

export const Dialog = {
  Root: Parts.Root,
  Trigger: Parts.Trigger,
  Portal: Parts.Portal,
  Backdrop: Parts.Backdrop,
  Positioner: Parts.Positioner,
  Content,
  Title: Parts.Title,
  Description: Parts.Description,
  Close: Parts.Close,
};

export type DialogContentProps = {
  container?: HTMLElement | null;
};
