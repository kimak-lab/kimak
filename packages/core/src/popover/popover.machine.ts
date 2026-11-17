import { createService, type Service } from "../machine";
import { samePosition } from "../platform/position";
import type { PopoverContext, PopoverEvent, PopoverProps } from "./popover.types";

export type PopoverService = Service<PopoverContext, PopoverProps, PopoverEvent>;

export function isPopoverOpen(context: PopoverContext, props: PopoverProps): boolean {
  return props.open ?? context.open;
}

function requestOpen(context: PopoverContext, props: PopoverProps, next: boolean): PopoverContext {
  if (isPopoverOpen(context, props) === next) return context;
  props.onOpenChange?.(next);
  if (props.open !== undefined || context.open === next) return context;
  return { ...context, open: next };
}

export function createPopoverMachine(props: PopoverProps): PopoverService {
  return createService<PopoverContext, PopoverProps, PopoverEvent>({
    props,
    context: (initial) => ({
      open: initial.defaultOpen ?? false,
      position: null,
      rendered: { title: false, description: false },
    }),
    on: (context, event, { props: currentProps }) => {
      switch (event.type) {
        case "OPEN":
          return requestOpen(context, currentProps, true);
        case "CLOSE":
          return requestOpen(context, currentProps, false);
        case "TOGGLE":
          return requestOpen(context, currentProps, !isPopoverOpen(context, currentProps));
        case "POSITION": {
          if (samePosition(context.position, event.position)) return context;
          return { ...context, position: event.position };
        }
        case "RENDERED": {
          const { title, description } = event.rendered;
          if (context.rendered.title === title && context.rendered.description === description) {
            return context;
          }
          return { ...context, rendered: { title, description } };
        }
        default: {
          const exhaustive: never = event;
          return exhaustive;
        }
      }
    },
  });
}
