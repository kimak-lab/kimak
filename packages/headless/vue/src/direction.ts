import type { Direction } from "@kimak/core";
import {
  defineComponent,
  h,
  inject,
  provide,
  type InjectionKey,
  type PropType,
  type VNode,
} from "vue";

const DirectionKey: InjectionKey<Direction> = Symbol("kimak-direction");

export const DirectionProvider = defineComponent({
  name: "KimakDirectionProvider",
  props: {
    dir: {
      type: String as PropType<Direction>,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide(DirectionKey, props.dir);
    return (): VNode | VNode[] | null | undefined => slots.default?.();
  },
});

export function useDirection(dir?: Direction): Direction {
  const context = inject(DirectionKey, "ltr" as Direction);
  return dir ?? context;
}
