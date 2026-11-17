<script setup lang="ts">
import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonAttrs,
  Popover,
} from "@kimak/ui-vue";
import type { ButtonGroupExample } from "../../lib/snippets/button-group";

const { example = "basic" } = defineProps<{ example?: ButtonGroupExample }>();

</script>

<template>
  <ButtonGroup v-if="example === 'basic'" aria-label="Archive">
    <Button variant="outline">Archive</Button>
    <Button variant="outline">Report</Button>
    <Button variant="outline">Snooze</Button>
  </ButtonGroup>
  <ButtonGroup v-else-if="example === 'orientation'" orientation="vertical" aria-label="Zoom">
    <Button variant="outline" size="icon" aria-label="Zoom in">+</Button>
    <Button variant="outline" size="icon" aria-label="Zoom out">−</Button>
  </ButtonGroup>
  <div v-else-if="example === 'sizes'" class="flex flex-wrap items-center gap-3">
    <ButtonGroup aria-label="Small">
      <Button variant="outline" size="sm">Small</Button>
      <Button variant="outline" size="sm">Button</Button>
    </ButtonGroup>
    <ButtonGroup aria-label="Default">
      <Button variant="outline">Default</Button>
      <Button variant="outline">Button</Button>
    </ButtonGroup>
    <ButtonGroup aria-label="Large">
      <Button variant="outline" size="lg">Large</Button>
      <Button variant="outline" size="lg">Button</Button>
    </ButtonGroup>
  </div>
  <ButtonGroup v-else-if="example === 'nested'" aria-label="Pagination">
    <ButtonGroup>
      <Button variant="outline" size="sm">1</Button>
      <Button variant="outline" size="sm">2</Button>
      <Button variant="outline" size="sm">3</Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="outline" size="sm">Previous</Button>
      <Button variant="outline" size="sm">Next</Button>
    </ButtonGroup>
  </ButtonGroup>
  <ButtonGroup v-else-if="example === 'separator'" aria-label="Clipboard">
    <Button variant="secondary" size="sm">Copy</Button>
    <ButtonGroupSeparator />
    <Button variant="secondary" size="sm">Paste</Button>
  </ButtonGroup>
  <ButtonGroup v-else-if="example === 'split'" aria-label="Merge">
    <Button>Merge</Button>
    <ButtonGroupSeparator />
    <Button size="icon" aria-label="More merge options">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </Button>
  </ButtonGroup>
  <ButtonGroup v-else-if="example === 'input'">
    <ButtonGroupText as="label" for="bg-site-vue">https://</ButtonGroupText>
    <input id="bg-site-vue" placeholder="example.com" data-demo-input />
    <Button variant="outline">Go</Button>
  </ButtonGroup>
  <ButtonGroup v-else-if="example === 'popover'" aria-label="Copilot">
    <Button variant="outline">Copilot</Button>
    <Popover align="end">
      <Popover.Trigger v-bind="buttonAttrs({ variant: 'outline', size: 'icon' })" aria-label="Agent tasks">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Popover.Trigger>
      <Popover.Content class="w-72">
        <Popover.Title>Agent tasks</Popover.Title>
        <Popover.Description>Describe your task in natural language.</Popover.Description>
      </Popover.Content>
    </Popover>
  </ButtonGroup>
</template>
