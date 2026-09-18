<script lang="ts">
  import { Button, type ButtonRootProps } from "@kimak/headless-svelte";
  import type { Snippet } from "svelte";

  let { children, ...props }: ButtonRootProps & { children?: Snippet } = $props();
</script>

<Button.Root {...props}>
  {@render children?.()}
  <Button.Indicator />
</Button.Root>
