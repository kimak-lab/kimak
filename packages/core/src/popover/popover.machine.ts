import { createService, type Service } from "../machine";
import { requestControllable, resolveControllable } from "../platform/controllable";
import { samePosition } from "../platform/position";
import type { PopoverContext, PopoverEvent, PopoverProps } from "./popover.types";

export type PopoverService = Service<PopoverContext, PopoverProps, PopoverEvent>;

export function isPopoverOpen(context: PopoverContext, props: PopoverProps): boolean {
  return resolveControllable(props.open, context.open);
}

function requestOpen(context: PopoverContext, props: PopoverProps, next: boolean): PopoverContext {
  const open = requestControllable({
    controlled: props.open,
    uncontrolled: context.open,
    next,
    onChange: props.onOpenChange,
  });
  return open === context.open ? context : { ...context, open };
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
