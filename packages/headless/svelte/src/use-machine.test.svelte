<script lang="ts">
  import { createCounterMachine } from "./fixtures/counter-machine";
  import { useMachine } from "./use-machine.svelte";

  let { count = 0 }: { count?: number } = $props();

  const service = useMachine(createCounterMachine, () => ({ count }));
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<button type="button" data-testid="count">{service.getSnapshot().context}</button>
<button type="button" data-testid="increment" onclick={() => service.send({ type: "INCREMENT" })}>
  Increment
</button>
