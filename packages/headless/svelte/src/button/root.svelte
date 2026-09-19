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
  import { omitNativeButtonAttrs } from "../omit-native-button-attrs";
  import { useMachine } from "../use-machine.svelte";
  import { BUTTON_KEY, type GetButtonApi } from "./context";

  type ButtonAs = "button" | "a";

  const MACHINE_KEYS = [
    "disabled",
    "loading",
    "focusableWhenDisabled",
    "type",
    "name",
    "value",
    "form",
    "dir",
    "ids",
    "onPress",
    "getRootNode",
  ] as const;

  let {
    children,
    id,
    as = "button",
    ...props
  }: CoreButtonProps & { children?: Snippet; as?: ButtonAs } & Record<string, unknown> = $props();
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

  let node = $state<HTMLElement | undefined>();
  const tag = $derived(as === "a" ? "a" : "button");
  const merged = $derived(mergeProps(api.getRootProps(), rest));
  const host = $derived(tag === "a" ? omitNativeButtonAttrs(merged) : merged);
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

<svelte:element this={tag} bind:this={node} {...omitRef(host)}>{@render children?.()}</svelte:element>
