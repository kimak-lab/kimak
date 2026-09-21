import { Button as Parts, mergeProps, type ButtonRootProps } from "@kimak/headless-vue";
import { defineComponent, h, type PropType, type VNode } from "vue";
import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";

export interface ButtonProps extends ButtonRootProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const ButtonField = defineComponent({
  name: "KimakButton",
  inheritAttrs: false,
  props: {
    variant: String as PropType<ButtonVariant | undefined>,
    size: String as PropType<ButtonSize | undefined>,
  },
  setup(props, { slots, attrs }) {
    return (): VNode =>
      h(
        Parts.Root,
        mergeProps(buttonAttrs({ variant: props.variant, size: props.size }), attrs),
        () => [slots.default?.(), h(Parts.Indicator)],
      );
  },
});

export const Button = Object.assign(ButtonField, {
  Root: Parts.Root,
  Indicator: Parts.Indicator,
});
