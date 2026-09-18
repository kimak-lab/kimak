<script lang="ts">
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { mergeProps } from "../merge-props";
  import { CHECKBOX_KEY, type GetCheckboxApi } from "./context";

  let { children, ...rest }: { children?: Snippet } & Record<string, unknown> = $props();
  const getApi = getContext<GetCheckboxApi>(CHECKBOX_KEY);
  if (!getApi) {
    throw new Error("[kimak] Checkbox parts must be wrapped in Checkbox.Root");
  }

  let node = $state<HTMLSpanElement | undefined>();
  const merged = $derived(mergeProps(getApi().getLabelProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

<span bind:this={node} {...omitRef(merged)}>{@render children?.()}</span>
