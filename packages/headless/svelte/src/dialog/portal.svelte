<script lang="ts">
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import Portal from "../portal.svelte";
  import Presence from "../presence.svelte";
  import { DIALOG_KEY, type DialogContextValue } from "./context";

  let {
    container = null,
    children,
  }: {
    container?: HTMLElement | null;
    children?: Snippet;
  } = $props();
  const ctx = getContext<DialogContextValue>(DIALOG_KEY);
  if (!ctx) {
    throw new Error("[kimak] Dialog parts must be wrapped in Dialog.Root");
  }
</script>

<Presence present={ctx.getApi().open} forceMount={ctx.getForceMount()}>
  <Portal {container}>
    {@render children?.()}
  </Portal>
</Presence>
