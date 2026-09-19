<script lang="ts">
  import { Button, type ButtonRootProps } from "@kimak/headless-svelte";
  import type { ButtonMotion } from "@kimak/motion-gsap";
  import type { Snippet } from "svelte";
  import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";
  import { bindButtonMotion } from "./button-motion";

  export interface ButtonProps extends ButtonRootProps {
    children?: Snippet;
    ref?: (node: HTMLElement | null) => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
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
