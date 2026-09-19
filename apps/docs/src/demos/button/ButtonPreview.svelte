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

<div class="row">
  {#if example === "playground"}
    <Button>Save</Button>
    <Button data-variant="outline">Cancel</Button>
  {:else if example === "variants"}
    <Button>Default</Button>
    <Button data-variant="secondary">Secondary</Button>
    <Button data-variant="outline">Outline</Button>
    <Button data-variant="ghost">Ghost</Button>
    <Button data-variant="destructive">Destructive</Button>
    <Button data-variant="link">Link</Button>
  {:else if example === "sizes"}
    <Button data-size="xs">XS</Button>
    <Button data-size="sm">Small</Button>
    <Button data-size="md">Medium</Button>
    <Button data-size="lg">Large</Button>
  {:else if example === "icons"}
    <Button>
      <Save data-icon="inline-start" size={16} aria-hidden="true" />
      Save
    </Button>
    <Button data-variant="outline">
      Next
      <ChevronRight data-icon="inline-end" size={16} aria-hidden="true" />
    </Button>
    <Button data-size="icon" aria-label="Settings">
      <Settings size={16} />
    </Button>
  {:else if example === "loading"}
    <Button loading>Saving</Button>
    <Button {loading} onPress={onSave}>Save</Button>
  {:else if example === "link"}
    <a href="/docs/getting-started" {...look}>Get started</a>
  {/if}
</div>
