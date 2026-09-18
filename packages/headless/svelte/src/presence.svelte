<script lang="ts">
  import { shouldMount } from "@kimak/core";
  import type { Snippet } from "svelte";

  let {
    present,
    forceMount = false,
    children,
  }: {
    present: boolean;
    forceMount?: boolean;
    children?: Snippet;
  } = $props();
</script>

{#if shouldMount({ present, forceMount })}
  {@render children?.()}
{/if}
