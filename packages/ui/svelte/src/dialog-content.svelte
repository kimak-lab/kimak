<script lang="ts">
  import { Dialog, type DialogRootProps } from "@kimak/headless-svelte";
  import type { Snippet } from "svelte";

  let {
    children,
    container = null,
    ...props
  }: { children?: Snippet; container?: HTMLElement | null } & Record<string, unknown> = $props();
</script>

<Dialog.Portal {container}>
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content {...props}>{@render children?.()}</Dialog.Content>
  </Dialog.Positioner>
</Dialog.Portal>
