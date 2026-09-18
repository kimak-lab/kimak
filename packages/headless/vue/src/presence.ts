import { shouldMount } from "@kimak/core";
import { defineComponent, type VNode } from "vue";

export const Presence = defineComponent({
  name: "KimakPresence",
  props: {
    present: {
      type: Boolean,
      required: true,
    },
    forceMount: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return (): VNode | VNode[] | null | undefined => {
      if (!shouldMount({ present: props.present, forceMount: props.forceMount })) {
        return null;
      }
      return slots.default?.();
    };
  },
});
