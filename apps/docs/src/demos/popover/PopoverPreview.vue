<script setup lang="ts">
import { ref } from "vue";
import { buttonAttrs, Popover } from "@kimak/ui-vue";
import type { PopoverExample } from "../../lib/snippets/popover";

const { example = "basic" } = defineProps<{ example?: PopoverExample }>();

const sides = ["top", "right", "bottom", "left"] as const;
const open = ref(false);
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Popover v-if="example === 'basic'">
      <Popover.Trigger v-bind="buttonAttrs({ variant: 'outline' })">Open popover</Popover.Trigger>
      <Popover.Content class="w-72">
        <Popover.Title>Dimensions</Popover.Title>
        <Popover.Description>Set the dimensions for the layer.</Popover.Description>
        <div class="mt-3 flex justify-end">
          <Popover.Close v-bind="buttonAttrs({ size: 'sm' })">Done</Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
    <template v-else-if="example === 'sides'">
      <Popover v-for="side in sides" :key="side" :side="side">
        <Popover.Trigger v-bind="buttonAttrs({ variant: 'outline' })">{{ side }}</Popover.Trigger>
        <Popover.Content>
          <p class="m-0 text-sm">Placed on the {{ side }}.</p>
        </Popover.Content>
      </Popover>
    </template>
    <Popover v-else-if="example === 'controlled'" v-model:open="open">
      <Popover.Trigger v-bind="buttonAttrs({ variant: 'outline' })">
        {{ open ? "Close" : "Open" }}
      </Popover.Trigger>
      <Popover.Content>
        <button type="button" v-bind="buttonAttrs({ size: 'sm' })" @click="open = false">
          Close from content
        </button>
      </Popover.Content>
    </Popover>
  </div>
</template>
