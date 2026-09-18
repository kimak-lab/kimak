import { Checkbox as Parts, type CheckboxRootProps } from "@kimak/headless-vue";
import { defineComponent, h, type PropType, type VNode } from "vue";

export interface CheckboxProps extends CheckboxRootProps {
  /** Replaces the default CSS check/dash from `@kimak/tailwind`. */
  indicator?: VNode | string;
}

const CheckboxField = defineComponent({
  name: "KimakCheckbox",
  inheritAttrs: false,
  props: {
    indicator: { type: [Object, String] as PropType<CheckboxProps["indicator"]>, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return (): VNode =>
      h(Parts.Root, attrs, () => [
        h(Parts.Control, () => h(Parts.Indicator, () => props.indicator)),
        slots.default ? h(Parts.Label, () => slots.default?.()) : null,
        h(Parts.HiddenInput),
      ]);
  },
});

export const Checkbox = Object.assign(CheckboxField, {
  Root: Parts.Root,
  Label: Parts.Label,
  Control: Parts.Control,
  Indicator: Parts.Indicator,
  HiddenInput: Parts.HiddenInput,
});
