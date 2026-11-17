<script lang="ts">
  import { Popover } from "./index";
  import Choice from "./choice.fixture.test.svelte";

  let { portalled = true }: { portalled?: boolean } = $props();
</script>

<div data-testid="host">
  <Popover>
    <Popover.Trigger>Open</Popover.Trigger>
    <Popover.Content {portalled}>
      <Popover.Title>Library</Popover.Title>
      <Choice label="Tabler" />
    </Popover.Content>
  </Popover>
</div>
