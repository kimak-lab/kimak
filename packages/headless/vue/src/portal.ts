import {
  Teleport,
  defineComponent,
  h,
  onMounted,
  ref,
  type PropType,
  type VNode,
} from "vue";

export const Portal = defineComponent({
  name: "KimakPortal",
  props: {
    container: {
      type: Object as PropType<HTMLElement | null>,
      default: null,
    },
  },
  setup(props, { slots }) {
    const mounted = ref(false);
    onMounted(() => {
      mounted.value = true;
    });

    return (): VNode | VNode[] | null | undefined => {
      if (!mounted.value) return null;
      return h(Teleport as never, { to: props.container ?? "body" }, slots.default?.());
    };
  },
});
