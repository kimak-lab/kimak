<script lang="ts">
  import { getContext } from "svelte";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { mergeProps } from "../merge-props";
  import { CHECKBOX_KEY, type GetCheckboxApi } from "./context";

  let { ...rest }: Record<string, unknown> = $props();
  const getApi = getContext<GetCheckboxApi>(CHECKBOX_KEY);
  if (!getApi) {
    throw new Error("[kimak] Checkbox parts must be wrapped in Checkbox.Root");
  }

  let node = $state<HTMLInputElement | undefined>();
  const merged = $derived(mergeProps(getApi().getHiddenInputProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

<input bind:this={node} {...omitRef(merged)} />
