import { Button as Parts, type ButtonRootProps } from "@kimak/headless-vue";
import { defineComponent, h, type VNode } from "vue";

export type ButtonProps = ButtonRootProps;

const ButtonField = defineComponent({
  name: "KimakButton",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    return (): VNode =>
      h(Parts.Root, attrs, () => [slots.default?.(), h(Parts.Indicator)]);
  },
});

export const Button = Object.assign(ButtonField, {
  Root: Parts.Root,
  Indicator: Parts.Indicator,
});
