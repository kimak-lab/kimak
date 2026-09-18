import { createService, type Service } from "../machine";
import type { ButtonContext, ButtonEvent, ButtonProps } from "./button.types";

export function createButtonMachine(
  props: ButtonProps,
): Service<ButtonContext, ButtonProps, ButtonEvent> {
  return createService<ButtonContext, ButtonProps, ButtonEvent>({
    props,
    context: () => ({}),
    on: (context, event, { props: currentProps }) => {
      switch (event.type) {
        case "PRESS": {
          if (currentProps.disabled || currentProps.loading) return context;
          currentProps.onPress?.();
          return context;
        }
        default: {
          const exhaustive: never = event.type;
          return exhaustive;
        }
      }
    },
  });
}
