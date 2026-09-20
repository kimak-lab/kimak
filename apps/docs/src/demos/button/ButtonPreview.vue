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
        <Save data-icon="inline-start" :size="16" aria-hidden="true" />
        Save
      </Button>
      <Button variant="outline">
        Next
        <ChevronRight data-icon="inline-end" :size="16" aria-hidden="true" />
      </Button>
      <Button size="icon" aria-label="Settings">
        <Settings :size="16" />
      </Button>
    </template>
    <template v-else-if="example === 'loading'">
      <Button loading>Saving</Button>
      <Button :loading="loading" :on-press="onSave">Save</Button>
    </template>
    <template v-else-if="example === 'motion'">
      <Button>Press</Button>
      <Button motion="soft">Soft</Button>
      <Button motion="bounce">Bounce</Button>
      <Button motion="sink">Sink</Button>
      <Button motion="lift">Lift</Button>
      <Button motion="ripple">Ripple</Button>
      <Button motion="magnetic">Magnetic</Button>
      <Button motion="shine">Shine</Button>
      <Button motion="none">None</Button>
    </template>
    <template v-else-if="example === 'link'">
      <a href="/docs/getting-started" v-bind="look">Get started</a>
    </template>
  </div>
</template>
