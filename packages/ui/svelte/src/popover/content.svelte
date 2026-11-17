<script lang="ts">
  import {
    Popover as Parts,
    Portal,
    type PopoverContentProps as PartsContentProps,
  } from "@kimak/headless-svelte";

  export interface PopoverContentProps extends PartsContentProps {
    /**
     * Render into a portal so the content escapes clipping ancestors.
     * @default true
     */
    portalled?: boolean;
    /** Portal target. Defaults to `document.body`. */
    container?: HTMLElement | null;
    /** Props forwarded to the positioner wrapper. */
    positionerProps?: Record<string, unknown>;
    [key: string]: unknown;
  }

  let {
    children,
    portalled = true,
    container = null,
    positionerProps = {},
    forceMount = false,
    ...props
  }: PopoverContentProps = $props();
</script>

{#snippet tree()}
  <Parts.Positioner {...positionerProps} {forceMount}>
    <Parts.Content {...props} {forceMount}>
      {@render children?.()}
    </Parts.Content>
  </Parts.Positioner>
{/snippet}

{#if portalled}
  <Portal {container}>{@render tree()}</Portal>
{:else}
  {@render tree()}
{/if}
