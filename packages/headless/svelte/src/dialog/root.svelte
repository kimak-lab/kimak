<script lang="ts">
  import {
    addDismissLayer,
    connectDialog,
    createDialogMachine,
    getOwnerDocument,
    handleEscapeKey,
    handleInteractOutside,
    lockScroll,
    splitProps,
    type DialogProps as CoreDialogProps,
  } from "@kimak/core";
  import type { Snippet } from "svelte";
  import { setContext } from "svelte";
  import { createKimakId } from "../create-id";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { useDirection } from "../direction";
  import { mergeProps } from "../merge-props";
  import { normalizeProps } from "../normalize-props";
  import { useMachine } from "../use-machine.svelte";
  import { DIALOG_KEY, type DialogContextValue, type GetDialogApi } from "./context";

  const MACHINE_KEYS = [
    "open",
    "defaultOpen",
    "modal",
    "closeOnEscape",
    "closeOnInteractOutside",
    "forceMount",
    "disabled",
    "role",
    "dir",
    "ids",
    "onOpenChange",
    "getRootNode",
  ] as const;

  let { children, id, ...props }: CoreDialogProps & { children?: Snippet } & Record<
    string,
    unknown
  > = $props();
  const split = $derived(splitProps(props, MACHINE_KEYS));
  const machineProps = $derived(split[0]);
  const rest = $derived(split[1]);
  const uid = createKimakId();
  const inheritedDir = useDirection();
  const service = useMachine(createDialogMachine, () => ({
    ...machineProps,
    dir: machineProps.dir ?? inheritedDir,
    id: id ?? uid,
  }));
  const api = $derived(connectDialog(service, normalizeProps));
  const getApi: GetDialogApi = () => api;
  setContext(DIALOG_KEY, {
    getApi,
    getForceMount: () => Boolean(machineProps.forceMount),
  });

  let node = $state<HTMLDivElement | undefined>();
  const merged = $derived(mergeProps(api.getRootProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });

  $effect(() => {
    if (!api.open) return;
    const layerId = String(id ?? uid);
    const doc = getOwnerDocument(machineProps.getRootNode);
    const removeLayer = addDismissLayer({
      id: layerId,
      closeOnEscape: machineProps.closeOnEscape,
      closeOnInteractOutside: machineProps.closeOnInteractOutside,
      onDismiss: () => service.send({ type: "CLOSE" }),
    });
    const onKeyDown = (event: KeyboardEvent) => {
      handleEscapeKey(event);
    };
    const onPointerDown = (event: PointerEvent) => {
      handleInteractOutside(event, {
        id: layerId,
        content: service.refs.content ?? null,
        exclude: [service.refs.trigger],
      });
    };
    doc.addEventListener("keydown", onKeyDown);
    doc.addEventListener("pointerdown", onPointerDown);
    const unlock = machineProps.modal !== false ? lockScroll(doc) : () => undefined;
    return () => {
      removeLayer();
      doc.removeEventListener("keydown", onKeyDown);
      doc.removeEventListener("pointerdown", onPointerDown);
      unlock();
      const trigger = service.refs.trigger;
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  });
</script>

<div bind:this={node} {...omitRef(merged)}>{@render children?.()}</div>
