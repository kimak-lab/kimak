<script lang="ts">
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";

  let {
    container = null,
    children,
  }: {
    container?: HTMLElement | null;
    children?: Snippet;
  } = $props();

  let mounted = $state(false);
  let host = $state<HTMLDivElement | undefined>();

  onMount(() => {
    mounted = true;
  });

  $effect(() => {
    if (!mounted || !host) return;
    const target = container ?? document.body;
    target.appendChild(host);
    return () => {
      host?.remove();
    };
  });
</script>

{#if mounted}
  <div bind:this={host} style="display: contents">
    {@render children?.()}
  </div>
{/if}
