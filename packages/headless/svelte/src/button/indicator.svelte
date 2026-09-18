<script lang="ts">
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { mergeProps } from "../merge-props";
  import { BUTTON_KEY, type GetButtonApi } from "./context";

  let { children, ...rest }: { children?: Snippet } & Record<string, unknown> = $props();
  const getApi = getContext<GetButtonApi>(BUTTON_KEY);
  if (!getApi) {
    throw new Error("[kimak] Button parts must be wrapped in Button.Root");
  }

  let node = $state<HTMLSpanElement | undefined>();
  const merged = $derived(mergeProps(getApi().getIndicatorProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

<span bind:this={node} {...omitRef(merged)}>{@render children?.()}</span>
