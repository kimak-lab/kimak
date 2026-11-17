<script lang="ts">
  import {
    Button,
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
    buttonAttrs,
    Popover,
  } from "@kimak/ui-svelte";
  import type { ButtonGroupExample } from "../../lib/snippets/button-group";

  let { example = "basic" }: { example?: ButtonGroupExample } = $props();

</script>

{#if example === "basic"}
  <ButtonGroup aria-label="Archive">
    <Button variant="outline">Archive</Button>
    <Button variant="outline">Report</Button>
    <Button variant="outline">Snooze</Button>
  </ButtonGroup>
{:else if example === "orientation"}
  <ButtonGroup orientation="vertical" aria-label="Zoom">
    <Button variant="outline" size="icon" aria-label="Zoom in">+</Button>
    <Button variant="outline" size="icon" aria-label="Zoom out">−</Button>
  </ButtonGroup>
{:else if example === "sizes"}
  <div class="flex flex-wrap items-center gap-3">
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
{:else if example === "nested"}
  <ButtonGroup aria-label="Pagination">
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
{:else if example === "separator"}
  <ButtonGroup aria-label="Clipboard">
    <Button variant="secondary" size="sm">Copy</Button>
    <ButtonGroupSeparator />
    <Button variant="secondary" size="sm">Paste</Button>
  </ButtonGroup>
{:else if example === "split"}
  <ButtonGroup aria-label="Merge">
    <Button>Merge</Button>
    <ButtonGroupSeparator />
    <Button size="icon" aria-label="More merge options">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </Button>
  </ButtonGroup>
{:else if example === "input"}
  <ButtonGroup>
    <ButtonGroupText as="label" for="bg-site-svelte">https://</ButtonGroupText>
    <input id="bg-site-svelte" placeholder="example.com" data-demo-input />
    <Button variant="outline">Go</Button>
  </ButtonGroup>
{:else if example === "popover"}
  <ButtonGroup aria-label="Copilot">
    <Button variant="outline">Copilot</Button>
    <Popover align="end">
      <Popover.Trigger {...buttonAttrs({ variant: "outline", size: "icon" })} aria-label="Agent tasks">
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
{/if}
