<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Button, buttonAttrs } from "@kimak/ui-vue";
import {
  getIconLibrary,
  getServerIconLibrary,
  subscribeIconLibrary,
  type IconLibrary,
} from "../../lib/icon-libraries";
import type { ButtonExample } from "../../lib/snippets/button";
import LibraryIcon from "../icons/LibraryIcon.vue";

const { example = "playground" } = defineProps<{ example?: ButtonExample }>();

const loading = ref(false);
const library = ref<IconLibrary>(getServerIconLibrary());
let stopLibrary: (() => void) | undefined;

onMounted(() => {
  library.value = getIconLibrary();
  stopLibrary = subscribeIconLibrary(() => {
    library.value = getIconLibrary();
  });
});

onBeforeUnmount(() => stopLibrary?.());
const look = buttonAttrs({ variant: "outline" });

function onSave() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 1200);
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <template v-if="example === 'playground'">
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
    </template>
    <template v-else-if="example === 'variants'">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </template>
    <template v-else-if="example === 'sizes'">
      <Button size="xs">XS</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </template>
    <template v-else-if="example === 'icons'">
      <Button>
        <LibraryIcon :library="library" role="save" data-icon="inline-start" aria-hidden="true" />
        Save
      </Button>
      <Button variant="outline">
        Next
        <LibraryIcon :library="library" role="next" data-icon="inline-end" aria-hidden="true" />
      </Button>
      <Button size="icon" aria-label="Settings">
        <LibraryIcon :library="library" role="settings" aria-hidden="true" />
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
