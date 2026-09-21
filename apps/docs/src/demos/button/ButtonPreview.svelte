<script lang="ts">
  import { Button, buttonAttrs } from "@kimak/ui-svelte";
  import Save from "@lucide/svelte/icons/save";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Settings from "@lucide/svelte/icons/settings";
  import type { ButtonExample } from "../../lib/snippets/button";

  let { example = "playground" }: { example?: ButtonExample } = $props();

  let loading = $state(false);
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
      <Save data-icon="inline-start" size={16} aria-hidden="true" />
      Save
    </Button>
    <Button variant="outline">
      Next
      <ChevronRight data-icon="inline-end" size={16} aria-hidden="true" />
    </Button>
    <Button size="icon" aria-label="Settings">
      <Settings size={16} />
    </Button>
  {:else if example === "loading"}
    <Button loading>Saving</Button>
    <Button {loading} onPress={onSave}>Save</Button>
  {:else if example === "link"}
    <a href="/docs/getting-started" {...look}>Get started</a>
  {/if}
</div>
