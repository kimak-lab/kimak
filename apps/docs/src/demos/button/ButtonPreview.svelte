<script lang="ts">
  import { Button } from "@kimak/ui-svelte";
  import Save from "@lucide/svelte/icons/save";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Settings from "@lucide/svelte/icons/settings";

  let loading = $state(false);

  function onSave() {
    loading = true;
    window.setTimeout(() => {
      loading = false;
    }, 1200);
  }
</script>

<div class="stack">
  <div class="row">
    <Button data-size="sm">Small</Button>
    <Button data-size="md">Medium</Button>
    <Button data-size="lg">Large</Button>
    <Button disabled>Disabled</Button>
    <Button loading>Loading</Button>
    <Button {loading} onPress={onSave}>Save</Button>
    <Button class="rounded-full">Custom class</Button>
  </div>
  <div class="row">
    <Button>Default</Button>
    <Button data-variant="secondary">Secondary</Button>
    <Button data-variant="outline">Outline</Button>
    <Button data-variant="ghost">Ghost</Button>
    <Button data-variant="destructive">Destructive</Button>
  </div>
  <div class="row">
    <Button>
      <Save size={16} aria-hidden="true" />
      Save
    </Button>
    <Button data-variant="outline">
      Next
      <ChevronRight size={16} aria-hidden="true" />
    </Button>
    <Button class="w-9 px-0" aria-label="Settings">
      <Settings size={16} />
    </Button>
  </div>
</div>
