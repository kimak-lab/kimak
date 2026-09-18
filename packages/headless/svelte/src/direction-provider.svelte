<script lang="ts">
  import type { Direction } from "@kimak/core";
  import type { Snippet } from "svelte";
  import { provideDirection } from "./direction";

  let { dir, children }: { dir: Direction; children?: Snippet } = $props();
  provideDirection(() => dir);
</script>

{@render children?.()}
