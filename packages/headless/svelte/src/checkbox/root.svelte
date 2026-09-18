<script lang="ts">
  import {
    connectCheckbox,
    createCheckboxMachine,
    splitProps,
    type CheckboxProps as CoreCheckboxProps,
  } from "@kimak/core";
  import type { Snippet } from "svelte";
  import { setContext } from "svelte";
  import { createKimakId } from "../create-id";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { useDirection } from "../direction";
  import { mergeProps } from "../merge-props";
  import { normalizeProps } from "../normalize-props";
  import { useMachine } from "../use-machine.svelte";
  import { CHECKBOX_KEY, type GetCheckboxApi } from "./context";

  const MACHINE_KEYS = [
    "checked",
    "defaultChecked",
    "disabled",
    "invalid",
    "required",
    "readOnly",
    "name",
    "form",
    "value",
    "dir",
    "ids",
    "onCheckedChange",
    "getRootNode",
  ] as const;

  let { children, id, ...props }: CoreCheckboxProps & { children?: Snippet } & Record<
    string,
    unknown
  > = $props();
  const split = $derived(splitProps(props, MACHINE_KEYS));
  const machineProps = $derived(split[0]);
  const rest = $derived(split[1]);
  const uid = createKimakId();
  const inheritedDir = useDirection();
  const service = useMachine(createCheckboxMachine, () => ({
    ...machineProps,
    dir: machineProps.dir ?? inheritedDir,
    id: id ?? uid,
  }));
  const api = $derived(connectCheckbox(service, normalizeProps));
  const getApi: GetCheckboxApi = () => api;
  setContext(CHECKBOX_KEY, getApi);

  let node = $state<HTMLLabelElement | undefined>();
  const merged = $derived(mergeProps(api.getRootProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

<label bind:this={node} {...omitRef(merged)}>{@render children?.()}</label>
