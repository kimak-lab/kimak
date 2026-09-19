import { mergeProps } from "@kimak/headless-vue";
import { defineComponent, h, type VNode } from "vue";
import { spinnerAttrs } from "./spinner-attrs";

export const Spinner = defineComponent({
  name: "KimakSpinner",
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    return (): VNode =>
      h("span", mergeProps(spinnerAttrs(), { "aria-hidden": true }, attrs), slots.default?.());
  },
});
