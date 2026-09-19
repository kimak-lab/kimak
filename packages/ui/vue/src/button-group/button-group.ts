import { mergeProps } from "@kimak/headless-vue";
import { defineComponent, h, type PropType, type VNode } from "vue";
import { buttonGroupAttrs, type ButtonGroupOrientation } from "./button-group-attrs";

export const ButtonGroup = defineComponent({
  name: "KimakButtonGroup",
  inheritAttrs: false,
  props: {
    orientation: String as PropType<ButtonGroupOrientation | undefined>,
  },
  setup(props, { slots, attrs }) {
    return (): VNode =>
      h(
        "div",
        mergeProps(buttonGroupAttrs({ orientation: props.orientation }), attrs),
        slots.default?.(),
      );
  },
});
