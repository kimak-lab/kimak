<script setup lang="ts">
import { ref } from "vue";
import { ChevronRight, Save, Settings } from "@lucide/vue";
import { Button, buttonAttrs } from "@kimak/ui-vue";
import type { ButtonExample } from "../../lib/snippets/button";

const { example = "playground" } = defineProps<{ example?: ButtonExample }>();

const loading = ref(false);
const look = buttonAttrs({ variant: "outline" });

function onSave() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 1200);
}
</script>

<template>
  <div class="row">
    <template v-if="example === 'playground'">
      <Button>Save</Button>
      <Button data-variant="outline">Cancel</Button>
    </template>
    <template v-else-if="example === 'variants'">
      <Button>Default</Button>
      <Button data-variant="secondary">Secondary</Button>
      <Button data-variant="outline">Outline</Button>
      <Button data-variant="ghost">Ghost</Button>
      <Button data-variant="destructive">Destructive</Button>
      <Button data-variant="link">Link</Button>
    </template>
    <template v-else-if="example === 'sizes'">
      <Button data-size="xs">XS</Button>
      <Button data-size="sm">Small</Button>
      <Button data-size="md">Medium</Button>
      <Button data-size="lg">Large</Button>
    </template>
    <template v-else-if="example === 'icons'">
      <Button>
        <Save data-icon="inline-start" :size="16" aria-hidden="true" />
        Save
      </Button>
      <Button data-variant="outline">
        Next
        <ChevronRight data-icon="inline-end" :size="16" aria-hidden="true" />
      </Button>
      <Button data-size="icon" aria-label="Settings">
        <Settings :size="16" />
      </Button>
    </template>
    <template v-else-if="example === 'loading'">
      <Button loading>Saving</Button>
      <Button :loading="loading" :on-press="onSave">Save</Button>
    </template>
    <template v-else-if="example === 'link'">
      <a href="/docs/getting-started" v-bind="look">Get started</a>
    </template>
  </div>
</template>
