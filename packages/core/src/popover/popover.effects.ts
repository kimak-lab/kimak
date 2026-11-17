import { addDismissLayer, handleEscapeKey, handleInteractOutside, isTopDismissLayer } from "../platform/dismiss";
import { getOwnerDocument } from "../platform/dom";
import { focusFirst } from "../platform/focus";
import { createId } from "../platform/ids";
import { autoUpdate, computePosition, getViewportSize } from "../platform/position";
import { getPopoverIds } from "./popover.connect";
import type { PopoverService } from "./popover.machine";
import { popoverDefaults } from "./popover.types";

function contains(node: Node | null | undefined, target: EventTarget | null): boolean {
  return Boolean(node && target instanceof Node && node.contains(target));
}

/**
 * Behavior for an open popover: dismiss layer (Escape, pointer and focus
 * outside), positioning, initial focus, and focus return. Framework-agnostic.
 * Call it once the positioner and content are mounted (e.g. a layout effect
 * while open); call the returned cleanup when the popover closes or unmounts.
 */
export function trackPopover(service: PopoverService): () => void {
  const initial = service.getSnapshot().props;
  const doc = getOwnerDocument(initial.getRootNode);
  const layerId = createId("popover");
  const trigger = service.refs.trigger ?? null;
  const content = service.refs.content ?? null;
  const positioner = service.refs.positioner ?? null;
  let interactedOutside = false;

  const props = () => service.getSnapshot().props;
  const close = () => service.send({ type: "CLOSE" });

  const removeLayer = addDismissLayer({
    id: layerId,
    onDismiss: close,
    get closeOnEscape() {
      return props().closeOnEscape ?? popoverDefaults.closeOnEscape;
    },
    get closeOnInteractOutside() {
      return props().closeOnInteractOutside ?? popoverDefaults.closeOnInteractOutside;
    },
  });

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || !isTopDismissLayer(layerId)) return;
    handleEscapeKey(event);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (contains(content, event.target) || contains(trigger, event.target)) return;
    if (!isTopDismissLayer(layerId)) return;
    if (props().closeOnInteractOutside === false) return;
    interactedOutside = true;
    handleInteractOutside(event, { id: layerId, content, exclude: [trigger] });
  };

  const onFocusIn = (event: FocusEvent) => {
    if (contains(content, event.target) || contains(trigger, event.target)) return;
    if (!isTopDismissLayer(layerId)) return;
    if (props().closeOnInteractOutside === false) return;
    interactedOutside = true;
    close();
  };

  doc.addEventListener("keydown", onKeyDown);
  doc.addEventListener("pointerdown", onPointerDown, true);
  doc.addEventListener("focusin", onFocusIn);

  const ids = getPopoverIds(initial);
  service.send({
    type: "RENDERED",
    rendered: {
      title: Boolean(doc.getElementById(ids.title)),
      description: Boolean(doc.getElementById(ids.description)),
    },
  });

  const stopPositioning =
    trigger && positioner
      ? autoUpdate(trigger, positioner, () => {
          const current = props();
          const anchorRect = trigger.getBoundingClientRect();
          const floatingRect = positioner.getBoundingClientRect();
          service.send({
            type: "POSITION",
            position: computePosition({
              anchor: {
                x: anchorRect.left,
                y: anchorRect.top,
                width: anchorRect.width,
                height: anchorRect.height,
              },
              floating: { width: floatingRect.width, height: floatingRect.height },
              viewport: getViewportSize(doc),
              side: current.side ?? popoverDefaults.side,
              align: current.align ?? popoverDefaults.align,
              sideOffset: current.sideOffset ?? popoverDefaults.sideOffset,
              collisionPadding: current.collisionPadding ?? popoverDefaults.collisionPadding,
              dir: current.dir,
            }),
          });
        })
      : () => {};

  if (content && !contains(content, doc.activeElement)) focusFirst(content);

  return () => {
    stopPositioning();
    removeLayer();
    doc.removeEventListener("keydown", onKeyDown);
    doc.removeEventListener("pointerdown", onPointerDown, true);
    doc.removeEventListener("focusin", onFocusIn);

    const active = doc.activeElement;
    const focusLost = !active || active === doc.body || contains(content, active);
    if (!interactedOutside && focusLost && trigger?.isConnected) trigger.focus();
  };
}
