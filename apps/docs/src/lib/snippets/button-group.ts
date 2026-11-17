export type ButtonGroupExample =
  | "basic"
  | "orientation"
  | "sizes"
  | "nested"
  | "separator"
  | "split"
  | "input"
  | "popover";

interface Snippets {
  react: string;
  vue?: string;
  svelte?: string;
}

function chevron(pad: string): string {
  return [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">',
    '  <path d="m6 9 6 6 6-6" />',
    "</svg>",
  ]
    .map((line) => pad + line)
    .join("\n");
}

export const buttonGroupSnippets = {
  basic: {
    react: `import { Button, ButtonGroup } from "@kimak/ui-react";

<ButtonGroup aria-label="Archive">
  <Button variant="outline">Archive</Button>
  <Button variant="outline">Report</Button>
  <Button variant="outline">Snooze</Button>
</ButtonGroup>`,
    vue: `<script setup>
import { Button, ButtonGroup } from "@kimak/ui-vue";
</script>

<template>
  <ButtonGroup aria-label="Archive">
    <Button variant="outline">Archive</Button>
    <Button variant="outline">Report</Button>
    <Button variant="outline">Snooze</Button>
  </ButtonGroup>
</template>`,
    svelte: `<script>
  import { Button, ButtonGroup } from "@kimak/ui-svelte";
</script>

<ButtonGroup aria-label="Archive">
  <Button variant="outline">Archive</Button>
  <Button variant="outline">Report</Button>
  <Button variant="outline">Snooze</Button>
</ButtonGroup>`,
  },
  orientation: {
    react: `<ButtonGroup orientation="vertical" aria-label="Zoom">
  <Button variant="outline" size="icon" aria-label="Zoom in">+</Button>
  <Button variant="outline" size="icon" aria-label="Zoom out">−</Button>
</ButtonGroup>`,
    vue: `<ButtonGroup orientation="vertical" aria-label="Zoom">
  <Button variant="outline" size="icon" aria-label="Zoom in">+</Button>
  <Button variant="outline" size="icon" aria-label="Zoom out">−</Button>
</ButtonGroup>`,
    svelte: `<ButtonGroup orientation="vertical" aria-label="Zoom">
  <Button variant="outline" size="icon" aria-label="Zoom in">+</Button>
  <Button variant="outline" size="icon" aria-label="Zoom out">−</Button>
</ButtonGroup>`,
  },
  sizes: {
    react: `<ButtonGroup aria-label="Small">
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
</ButtonGroup>`,
    vue: `<ButtonGroup aria-label="Small">
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
</ButtonGroup>`,
    svelte: `<ButtonGroup aria-label="Small">
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
</ButtonGroup>`,
  },
  nested: {
    react: `<ButtonGroup aria-label="Pagination">
  <ButtonGroup>
    <Button variant="outline" size="sm">1</Button>
    <Button variant="outline" size="sm">2</Button>
    <Button variant="outline" size="sm">3</Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline" size="sm">Previous</Button>
    <Button variant="outline" size="sm">Next</Button>
  </ButtonGroup>
</ButtonGroup>`,
    vue: `<ButtonGroup aria-label="Pagination">
  <ButtonGroup>
    <Button variant="outline" size="sm">1</Button>
    <Button variant="outline" size="sm">2</Button>
    <Button variant="outline" size="sm">3</Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline" size="sm">Previous</Button>
    <Button variant="outline" size="sm">Next</Button>
  </ButtonGroup>
</ButtonGroup>`,
    svelte: `<ButtonGroup aria-label="Pagination">
  <ButtonGroup>
    <Button variant="outline" size="sm">1</Button>
    <Button variant="outline" size="sm">2</Button>
    <Button variant="outline" size="sm">3</Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline" size="sm">Previous</Button>
    <Button variant="outline" size="sm">Next</Button>
  </ButtonGroup>
</ButtonGroup>`,
  },
  separator: {
    react: `import { Button, ButtonGroup, ButtonGroupSeparator } from "@kimak/ui-react";

<ButtonGroup aria-label="Clipboard">
  <Button variant="secondary" size="sm">Copy</Button>
  <ButtonGroupSeparator />
  <Button variant="secondary" size="sm">Paste</Button>
</ButtonGroup>`,
    vue: `<ButtonGroup aria-label="Clipboard">
  <Button variant="secondary" size="sm">Copy</Button>
  <ButtonGroupSeparator />
  <Button variant="secondary" size="sm">Paste</Button>
</ButtonGroup>`,
    svelte: `<ButtonGroup aria-label="Clipboard">
  <Button variant="secondary" size="sm">Copy</Button>
  <ButtonGroupSeparator />
  <Button variant="secondary" size="sm">Paste</Button>
</ButtonGroup>`,
  },
  split: {
    react: `<ButtonGroup aria-label="Merge">
  <Button>Merge</Button>
  <ButtonGroupSeparator />
  <Button size="icon" aria-label="More merge options">
${chevron("    ")}
  </Button>
</ButtonGroup>`,
    vue: `<ButtonGroup aria-label="Merge">
  <Button>Merge</Button>
  <ButtonGroupSeparator />
  <Button size="icon" aria-label="More merge options">
${chevron("    ")}
  </Button>
</ButtonGroup>`,
    svelte: `<ButtonGroup aria-label="Merge">
  <Button>Merge</Button>
  <ButtonGroupSeparator />
  <Button size="icon" aria-label="More merge options">
${chevron("    ")}
  </Button>
</ButtonGroup>`,
  },
  input: {
    react: `import { Button, ButtonGroup, ButtonGroupText } from "@kimak/ui-react";

<ButtonGroup>
  <ButtonGroupText render={<label htmlFor="site" />}>https://</ButtonGroupText>
  <input id="site" placeholder="example.com" />
  <Button variant="outline">Go</Button>
</ButtonGroup>`,
    vue: `<ButtonGroup>
  <ButtonGroupText as="label" for="site">https://</ButtonGroupText>
  <input id="site" placeholder="example.com" />
  <Button variant="outline">Go</Button>
</ButtonGroup>`,
    svelte: `<ButtonGroup>
  <ButtonGroupText as="label" for="site">https://</ButtonGroupText>
  <input id="site" placeholder="example.com" />
  <Button variant="outline">Go</Button>
</ButtonGroup>`,
  },
  popover: {
    react: `import { Button, ButtonGroup, Popover, buttonAttrs } from "@kimak/ui-react";

<ButtonGroup aria-label="Copilot">
  <Button variant="outline">Copilot</Button>
  <Popover align="end">
    <Popover.Trigger {...buttonAttrs({ variant: "outline", size: "icon" })} aria-label="Agent tasks">
${chevron("      ")}
    </Popover.Trigger>
    <Popover.Content className="w-72">
      <Popover.Title>Agent tasks</Popover.Title>
      <Popover.Description>Describe your task in natural language.</Popover.Description>
    </Popover.Content>
  </Popover>
</ButtonGroup>`,
  },
} as const satisfies Record<ButtonGroupExample, Snippets>;
