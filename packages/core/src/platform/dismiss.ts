export interface DismissLayer {
  id: string;
  onDismiss: () => void;
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
}

const stack: DismissLayer[] = [];

export function resetDismissStack(): void {
  stack.length = 0;
}

export function addDismissLayer(layer: DismissLayer): () => void {
  stack.push(layer);
  return () => {
    const index = stack.lastIndexOf(layer);
    if (index >= 0) stack.splice(index, 1);
  };
}

export function getTopDismissLayer(): DismissLayer | undefined {
  return stack[stack.length - 1];
}

export function isTopDismissLayer(id: string): boolean {
  return getTopDismissLayer()?.id === id;
}

export function handleEscapeKey(event: KeyboardEvent): void {
  if (event.key !== "Escape") return;
  const top = getTopDismissLayer();
  if (!top || top.closeOnEscape === false) return;
  event.preventDefault();
  top.onDismiss();
}

export function handleInteractOutside(
  event: Event,
  content: EventTarget | null,
): void {
  const top = getTopDismissLayer();
  if (!top || top.closeOnInteractOutside === false) return;
  if (content && event.target instanceof Node && content instanceof Node) {
    if (content.contains(event.target)) return;
  }
  top.onDismiss();
}
