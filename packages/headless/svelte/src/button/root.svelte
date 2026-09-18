<script lang="ts">
  import {
    connectButton,
    createButtonMachine,
    splitProps,
    type ButtonProps as CoreButtonProps,
  } from "@kimak/core";
  import type { Snippet } from "svelte";
  import { setContext } from "svelte";
  import { createKimakId } from "../create-id";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { useDirection } from "../direction";
  import { mergeProps } from "../merge-props";
  import { normalizeProps } from "../normalize-props";
  import { useMachine } from "../use-machine.svelte";
  import { BUTTON_KEY, type GetButtonApi } from "./context";

  const MACHINE_KEYS = [
    "disabled",
    "loading",
    "type",
    "name",
    "value",
    "form",
    "dir",
    "ids",
    "onPress",
    "getRootNode",
  ] as const;

  let { children, id, ...props }: CoreButtonProps & { children?: Snippet } & Record<
    string,
    unknown
  > = $props();
  const split = $derived(splitProps(props, MACHINE_KEYS));
  const machineProps = $derived(split[0]);
  const rest = $derived(split[1]);
  const uid = createKimakId();
  const inheritedDir = useDirection();
  const service = useMachine(createButtonMachine, () => ({
    ...machineProps,
    dir: machineProps.dir ?? inheritedDir,
    id: id ?? uid,
  }));
  const api = $derived(connectButton(service, normalizeProps));
  const getApi: GetButtonApi = () => api;
  setContext(BUTTON_KEY, getApi);

  let node = $state<HTMLButtonElement | undefined>();
  const merged = $derived(mergeProps(api.getRootProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

<button bind:this={node} {...omitRef(merged)}>{@render children?.()}</button>
