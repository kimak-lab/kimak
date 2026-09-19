<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { spinnerAttrs } from "./spinner-attrs";

  let { children, ...props }: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
  const look = spinnerAttrs();
</script>

<span {...look} aria-hidden="true" {...props}>{@render children?.()}</span>
