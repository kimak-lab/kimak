import { Button as Parts, mergeProps, type ButtonRootProps } from "@kimak/headless-vue";
import type { ButtonMotion, ButtonMotionVariant } from "@kimak/motion-gsap";
import {
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type ComponentPublicInstance,
  type PropType,
  type VNode,
} from "vue";
import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";
import { bindButtonMotion, hostElement } from "./button-motion";

export type { ButtonMotionVariant };

export interface ButtonProps extends ButtonRootProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  motion?: ButtonMotionVariant;
}

const ButtonField = defineComponent({
  name: "KimakButton",
  inheritAttrs: false,
  props: {
    variant: String as PropType<ButtonVariant | undefined>,
    size: String as PropType<ButtonSize | undefined>,
    motion: String as PropType<ButtonMotionVariant | undefined>,
  },
  setup(props, { slots, attrs }) {
    const rootRef = ref<ComponentPublicInstance | HTMLElement | null>(null);
    let motionHandle: ButtonMotion | undefined;

    function rebind(): void {
      motionHandle?.revert();
      motionHandle = bindButtonMotion(hostElement(rootRef.value), {
        motion: props.motion ?? "press",
      });
    }

    onMounted(rebind);
    watch(() => props.motion, rebind);

    onUnmounted(() => {
      motionHandle?.revert();
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
