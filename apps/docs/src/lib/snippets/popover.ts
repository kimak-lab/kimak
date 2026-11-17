export type PopoverExample = "basic" | "sides" | "controlled";

export const popoverSnippets = {
  basic: {
    react: `import { Popover, buttonAttrs } from "@kimak/ui-react";

<Popover>
  <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>Open popover</Popover.Trigger>
  <Popover.Content className="w-72">
    <Popover.Title>Dimensions</Popover.Title>
    <Popover.Description>Set the dimensions for the layer.</Popover.Description>
    <Popover.Close {...buttonAttrs({ size: "sm" })}>Done</Popover.Close>
  </Popover.Content>
</Popover>`,
    vue: `<script setup>
import { Popover, buttonAttrs } from "@kimak/ui-vue";
</script>

<template>
  <Popover>
    <Popover.Trigger v-bind="buttonAttrs({ variant: 'outline' })">Open popover</Popover.Trigger>
    <Popover.Content class="w-72">
      <Popover.Title>Dimensions</Popover.Title>
      <Popover.Description>Set the dimensions for the layer.</Popover.Description>
      <Popover.Close v-bind="buttonAttrs({ size: 'sm' })">Done</Popover.Close>
    </Popover.Content>
  </Popover>
</template>`,
    svelte: `<script>
  import { Popover, buttonAttrs } from "@kimak/ui-svelte";
</script>

<Popover>
  <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>Open popover</Popover.Trigger>
  <Popover.Content class="w-72">
    <Popover.Title>Dimensions</Popover.Title>
    <Popover.Description>Set the dimensions for the layer.</Popover.Description>
    <Popover.Close {...buttonAttrs({ size: "sm" })}>Done</Popover.Close>
  </Popover.Content>
</Popover>`,
  },
  sides: {
    react: `import { Popover, buttonAttrs } from "@kimak/ui-react";

{(["top", "right", "bottom", "left"] as const).map((side) => (
  <Popover key={side} side={side}>
    <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>{side}</Popover.Trigger>
    <Popover.Content>Placed on the {side}.</Popover.Content>
  </Popover>
))}`,
    vue: `<script setup>
import { Popover, buttonAttrs } from "@kimak/ui-vue";

const sides = ["top", "right", "bottom", "left"];
</script>

<template>
  <Popover v-for="side in sides" :key="side" :side="side">
    <Popover.Trigger v-bind="buttonAttrs({ variant: 'outline' })">{{ side }}</Popover.Trigger>
    <Popover.Content>Placed on the {{ side }}.</Popover.Content>
  </Popover>
</template>`,
    svelte: `<script>
  import { Popover, buttonAttrs } from "@kimak/ui-svelte";

  const sides = ["top", "right", "bottom", "left"];
</script>

{#each sides as side (side)}
  <Popover {side}>
    <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>{side}</Popover.Trigger>
    <Popover.Content>Placed on the {side}.</Popover.Content>
  </Popover>
{/each}`,
  },
  controlled: {
    react: `import { useState } from "react";
import { Popover, buttonAttrs } from "@kimak/ui-react";

function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>
        {open ? "Close" : "Open"}
      </Popover.Trigger>
      <Popover.Content>
        <button type="button" {...buttonAttrs({ size: "sm" })} onClick={() => setOpen(false)}>
          Close from content
        </button>
      </Popover.Content>
    </Popover>
  );
}`,
    vue: `<script setup>
import { ref } from "vue";
import { Popover, buttonAttrs } from "@kimak/ui-vue";

const open = ref(false);
</script>

<template>
  <Popover v-model:open="open">
    <Popover.Trigger v-bind="buttonAttrs({ variant: 'outline' })">
      {{ open ? "Close" : "Open" }}
    </Popover.Trigger>
    <Popover.Content>
      <button type="button" v-bind="buttonAttrs({ size: 'sm' })" @click="open = false">
        Close from content
      </button>
    </Popover.Content>
  </Popover>
</template>`,
    svelte: `<script>
  import { Popover, buttonAttrs } from "@kimak/ui-svelte";

  let open = $state(false);
</script>

<Popover bind:open>
  <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>
    {open ? "Close" : "Open"}
  </Popover.Trigger>
  <Popover.Content>
    <button type="button" {...buttonAttrs({ size: "sm" })} onclick={() => (open = false)}>
      Close from content
    </button>
  </Popover.Content>
</Popover>`,
  },
} as const satisfies Record<PopoverExample, { react: string; vue: string; svelte: string }>;
