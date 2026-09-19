<script lang="ts">
  import { Button, type ButtonRootProps } from "@kimak/headless-svelte";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";
  import { bindButtonMotion, type ButtonMotion } from "./button-motion";

  export interface ButtonProps
    extends ButtonRootProps,
      Omit<HTMLButtonAttributes, keyof ButtonRootProps> {
    children?: Snippet;
    ref?: (node: HTMLElement | null) => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
  }

  let {
    children,
    ref: consumerRef,
    variant,
    size,
    ...props
  }: ButtonProps = $props();

  const look = $derived(buttonAttrs({ variant, size }));

  let motion: ButtonMotion | undefined;

  function ref(node: HTMLElement | null) {
    motion?.revert();
    motion = bindButtonMotion(node);
    if (typeof consumerRef === "function") consumerRef(node);
  }
</script>

<Button.Root {...look} {...props} {ref}>
  {@render children?.()}
  <Button.Indicator />
</Button.Root>
