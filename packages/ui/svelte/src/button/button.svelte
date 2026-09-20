<script lang="ts">
  import { Button, type ButtonRootProps } from "@kimak/headless-svelte";
  import type { ButtonMotionVariant } from "@kimak/motion-gsap";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";
  import { bindButtonMotion, type ButtonMotion } from "./button-motion";

  export type { ButtonMotionVariant };

  export interface ButtonProps
    extends ButtonRootProps,
      Omit<HTMLButtonAttributes, keyof ButtonRootProps> {
    children?: Snippet;
    ref?: (node: HTMLElement | null) => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
    motion?: ButtonMotionVariant;
  }

  let {
    children,
    ref: consumerRef,
    variant,
    size,
    motion = "press",
    ...props
  }: ButtonProps = $props();

  const look = $derived(buttonAttrs({ variant, size }));

  let host = $state<HTMLElement | null>(null);
  let motionHandle: ButtonMotion | undefined;

  function ref(node: HTMLElement | null) {
    host = node;
    if (typeof consumerRef === "function") consumerRef(node);
  }

  $effect(() => {
    const node = host;
    const kind = motion;
    motionHandle?.revert();
    motionHandle = bindButtonMotion(node, { motion: kind });
    return () => {
      motionHandle?.revert();
      motionHandle = undefined;
    };
  });
</script>

<Button.Root {...look} {...props} {ref}>
  {@render children?.()}
  <Button.Indicator />
</Button.Root>
