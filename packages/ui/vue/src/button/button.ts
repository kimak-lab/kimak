import { animateButton, type ButtonMotion } from "@kimak/motion-gsap";
import { Button as Parts, mergeProps, type ButtonRootProps } from "@kimak/headless-vue";
import {
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  ref,
  type ComponentPublicInstance,
  type PropType,
  type VNode,
} from "vue";
import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";
import { bindButtonMotion, hostElement } from "./button-motion";

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
    const rootRef = ref<ComponentPublicInstance | HTMLElement | null>(null);
    let motion: ButtonMotion | undefined;

    onMounted(() => {
      motion = bindButtonMotion(hostElement(rootRef.value));
    });

    onUnmounted(() => {
      motion?.revert();
    });

    return (): VNode =>
      h(
        Parts.Root,
        mergeProps(buttonAttrs({ variant: props.variant, size: props.size }), attrs, {
          ref: rootRef,
        }),
        () => [slots.default?.(), h(Parts.Indicator)],
      );
  },
});

export const Button = Object.assign(ButtonField, {
  Root: Parts.Root,
  Indicator: Parts.Indicator,
});
