<script lang="ts">
  import { Dialog as Parts } from "@kimak/headless-svelte";
  import type { Snippet } from "svelte";

  let {
    children,
    container = null,
    ...props
  }: { children?: Snippet; container?: HTMLElement | null } & Record<string, unknown> = $props();
</script>

<Parts.Portal {container}>
  <Parts.Backdrop />
  <Parts.Positioner>
    <Parts.Content {...props}>{@render children?.()}</Parts.Content>
  </Parts.Positioner>
</Parts.Portal>
