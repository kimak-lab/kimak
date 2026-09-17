import { createService, type Service } from "../machine";
import type { DialogContext, DialogEvent, DialogProps } from "./dialog.types";

function isControlled(props: DialogProps): boolean {
  return props.open !== undefined;
}

export function createDialogMachine(
  props: DialogProps,
): Service<DialogContext, DialogProps, DialogEvent> {
  return createService<DialogContext, DialogProps, DialogEvent>({
    props,
    context: (initial) => ({
      open: initial.defaultOpen ?? false,
    }),
    on: (context, event, { props: currentProps }) => {
      const emit = (open: boolean) => {
        if (open === (isControlled(currentProps) ? currentProps.open : context.open)) {
          return context;
        }
        currentProps.onOpenChange?.({ open });
        if (isControlled(currentProps)) return context;
        return { ...context, open };
      };

      switch (event.type) {
        case "OPEN":
          if (currentProps.disabled) return context;
          return emit(true);
        case "CLOSE":
          return emit(false);
        case "TOGGLE":
          if (currentProps.disabled) return context;
          return emit(!(isControlled(currentProps) ? currentProps.open : context.open));
        case "SET_OPEN":
          if (currentProps.disabled && event.open) return context;
          return emit(event.open);
        default: {
          const exhaustive: never = event;
          return exhaustive;
        }
      }
    },
  });
}
