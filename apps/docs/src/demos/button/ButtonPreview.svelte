<script lang="ts">
  import { Button, buttonAttrs } from "@kimak/ui-svelte";
  import {
    getIconLibrary,
    getServerIconLibrary,
    subscribeIconLibrary,
    type IconLibrary,
  } from "../../lib/icon-libraries";
  import type { ButtonExample } from "../../lib/snippets/button";
  import LibraryIcon from "../icons/LibraryIcon.svelte";

  let { example = "playground" }: { example?: ButtonExample } = $props();

  let loading = $state(false);
  let library = $state<IconLibrary>(getServerIconLibrary());

  $effect(() => {
    library = getIconLibrary();
    return subscribeIconLibrary(() => {
      library = getIconLibrary();
    });
  });
  const look = buttonAttrs({ variant: "outline" });

  function onSave() {
    loading = true;
    window.setTimeout(() => {
      loading = false;
    }, 1200);
  }
</script>

<div class="flex flex-wrap items-center gap-3">
  {#if example === "playground"}
    <Button>Save</Button>
    <Button variant="outline">Cancel</Button>
  {:else if example === "variants"}
    <Button>Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="link">Link</Button>
  {:else if example === "sizes"}
    <Button size="xs">XS</Button>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  {:else if example === "icons"}
    <Button>
      <LibraryIcon {library} role="save" data-icon="inline-start" aria-hidden="true" />
      Save
    </Button>
    <Button variant="outline">
      Next
      <LibraryIcon {library} role="next" data-icon="inline-end" aria-hidden="true" />
    </Button>
    <Button size="icon" aria-label="Settings">
      <LibraryIcon {library} role="settings" aria-hidden="true" />
    </Button>
  {:else if example === "loading"}
    <Button loading>Saving</Button>
    <Button {loading} onPress={onSave}>Save</Button>
  {:else if example === "link"}
    <a href="/docs/getting-started" {...look}>Get started</a>
  {/if}
</div>
