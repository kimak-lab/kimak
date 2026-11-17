<script lang="ts">
  import { Popover } from "./index";

  let open = $state(false);
</script>

<span data-testid="state">{open ? "open" : "closed"}</span>
<Popover.Root bind:open>
  <Popover.Trigger>Settings</Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <button type="button">Compact</button>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>
