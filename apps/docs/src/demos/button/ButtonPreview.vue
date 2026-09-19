<script setup lang="ts">
import { ref } from "vue";
import { ChevronRight, Save, Settings } from "@lucide/vue";
import { Button } from "@kimak/ui-vue";

const loading = ref(false);

function onSave() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 1200);
}
</script>

<template>
  <div class="stack">
    <div class="row">
      <Button data-size="sm">Small</Button>
      <Button data-size="md">Medium</Button>
      <Button data-size="lg">Large</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button :loading="loading" :on-press="onSave">Save</Button>
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
        <Save :size="16" aria-hidden="true" />
        Save
      </Button>
      <Button data-variant="outline">
        Next
        <ChevronRight :size="16" aria-hidden="true" />
      </Button>
      <Button class="w-9 px-0" aria-label="Settings">
        <Settings :size="16" />
      </Button>
    </div>
  </div>
</template>
