import { defineComponent, onMounted, ref, type PropType, type VNode } from "vue";

export const Portal = defineComponent({
  name: "KimakPortal",
  props: {
    container: {
      type: Object as PropType<HTMLElement | null>,
      default: null,
    },
  },
  setup(_props, { slots }) {
    const mounted = ref(false);
    onMounted(() => {
      mounted.value = true;
    });

    return (): VNode | VNode[] | null | undefined => {
      if (!mounted.value) return null;
      // Teleport wiring lands with Dialog port.
      return slots.default?.();
    };
  },
});
