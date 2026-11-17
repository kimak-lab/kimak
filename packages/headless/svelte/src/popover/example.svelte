<script lang="ts">
  import type { PopoverProps } from "@kimak/core";
  import { Popover } from "./index";

  let { withTitle = true, ...rootProps }: PopoverProps & { withTitle?: boolean } = $props();
</script>

<Popover.Root {...rootProps}>
  <Popover.Trigger>Settings</Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      {#if withTitle}
        <Popover.Title>Display</Popover.Title>
      {/if}
      <Popover.Description>Pick a density.</Popover.Description>
      <button type="button">Compact</button>
      <Popover.Close>Done</Popover.Close>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>
<button type="button">Outside</button>
