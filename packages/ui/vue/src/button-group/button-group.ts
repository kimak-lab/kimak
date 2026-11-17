import { mergeProps } from "@kimak/headless-vue";
import { defineComponent, h, type PropType, type VNode } from "vue";
import {
  buttonGroupAttrs,
  buttonGroupSeparatorAttrs,
  buttonGroupTextAttrs,
  type ButtonGroupOrientation,
} from "./button-group-attrs";

/** Groups related action buttons. Label it with `aria-label` or `aria-labelledby`. */
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
        mergeProps(buttonGroupAttrs({ orientation: props.orientation }), { role: "group" }, attrs),
        slots.default?.(),
      );
  },
});

export const ButtonGroupSeparator = defineComponent({
  name: "KimakButtonGroupSeparator",
  inheritAttrs: false,
  props: {
    /** Defaults to `vertical`, the divider for a horizontal group. */
    orientation: {
      type: String as PropType<ButtonGroupOrientation>,
      default: "vertical",
    },
  },
  setup(props, { attrs }) {
    return (): VNode =>
      h(
        "div",
        mergeProps(
          buttonGroupSeparatorAttrs({ orientation: props.orientation }),
          { role: "separator", "aria-orientation": props.orientation },
          attrs,
        ),
      );
  },
});

export const ButtonGroupText = defineComponent({
  name: "KimakButtonGroupText",
  inheritAttrs: false,
  props: {
    /** Element to render, e.g. `as="label"` with `for`. */
    as: {
      type: String,
      default: "div",
    },
  },
  setup(props, { slots, attrs }) {
    return (): VNode => h(props.as, mergeProps(buttonGroupTextAttrs(), attrs), slots.default?.());
  },
});
