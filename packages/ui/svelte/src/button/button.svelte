<script lang="ts">
  import { Button, type ButtonRootProps } from "@kimak/headless-svelte";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";

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
</script>

<Button.Root {...look} {...props} ref={consumerRef}>
  {@render children?.()}
  <Button.Indicator />
</Button.Root>
