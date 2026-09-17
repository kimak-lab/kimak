import { createService, type Service } from "../machine";
import {
  toggleChecked,
  type CheckboxContext,
  type CheckboxEvent,
  type CheckboxProps,
} from "./checkbox.types";

function isControlled(props: CheckboxProps): boolean {
  return props.checked !== undefined;
}

function resolveChecked(props: CheckboxProps, context: CheckboxContext): CheckboxContext["checked"] {
  return isControlled(props) ? (props.checked as CheckboxContext["checked"]) : context.checked;
}

export function createCheckboxMachine(
  props: CheckboxProps,
): Service<CheckboxContext, CheckboxProps, CheckboxEvent> {
  return createService<CheckboxContext, CheckboxProps, CheckboxEvent>({
    props,
    context: (initial) => ({
      checked: initial.defaultChecked ?? false,
    }),
    on: (context, event, { props: currentProps }) => {
      const emit = (checked: CheckboxContext["checked"]) => {
        currentProps.onCheckedChange?.({ checked });
        if (isControlled(currentProps)) return context;
        return { ...context, checked };
      };

      switch (event.type) {
        case "TOGGLE": {
          if (currentProps.disabled || currentProps.readOnly) return context;
          return emit(toggleChecked(resolveChecked(currentProps, context)));
        }
        case "SET_CHECKED": {
          if (currentProps.disabled || currentProps.readOnly) return context;
          return emit(event.checked);
        }
        default: {
          const exhaustive: never = event;
          return exhaustive;
        }
      }
    },
  });
}
