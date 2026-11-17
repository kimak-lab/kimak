<script lang="ts">
  import { usePopover } from "./index";

  let { label }: { label: string } = $props();
  const getPopover = usePopover();
</script>

<button type="button" onclick={() => getPopover().setOpen(false)}>{label}</button>
