<script lang="ts">
  import {
    connectPopover,
    createPopoverMachine,
    type PopoverProps as CorePopoverProps,
  } from "@kimak/core";
  import type { Snippet } from "svelte";
  import { setContext } from "svelte";
  import { createKimakId } from "../create-id";
  import { useDirection } from "../direction";
  import { normalizeProps } from "../normalize-props";
  import { useMachine } from "../use-machine.svelte";
  import { POPOVER_KEY, type PopoverContextValue } from "./context";

  let {
    children,
    id,
    open = $bindable(),
    defaultOpen,
    side,
    align,
    sideOffset,
    collisionPadding,
    closeOnEscape,
    closeOnInteractOutside,
    dir,
    ids,
    onOpenChange,
    getRootNode,
  }: CorePopoverProps & { children?: Snippet } = $props();

  const uid = createKimakId();
  const inheritedDir = useDirection();
  const service = useMachine(createPopoverMachine, () => ({
    id: id ?? uid,
    ids,
    open,
    defaultOpen,
    side,
    align,
    sideOffset,
    collisionPadding,
    closeOnEscape,
    closeOnInteractOutside,
    dir: dir ?? inheritedDir,
    getRootNode,
    onOpenChange: (next: boolean) => {
      // `bind:open` stays in sync; a plain `open` prop is controlled by the parent.
      if (open !== undefined) open = next;
      onOpenChange?.(next);
    },
  }));
  const api = $derived(connectPopover(service, normalizeProps));
  const context: PopoverContextValue = { getApi: () => api, service };
  setContext(POPOVER_KEY, context);
</script>

{@render children?.()}
