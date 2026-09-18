<script lang="ts">
  import { Button as Parts, type ButtonRootProps } from "@kimak/headless-svelte";
  import type { Snippet } from "svelte";

  let { children, ...props }: ButtonRootProps & { children?: Snippet } = $props();
</script>

<Parts.Root {...props}>
  {@render children?.()}
  <Parts.Indicator />
</Parts.Root>
