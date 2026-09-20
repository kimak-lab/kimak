export type ButtonExample = "playground" | "variants" | "sizes" | "icons" | "loading" | "link";

export const buttonSnippets = {
  playground: {
    react: `import { Button } from "@kimak/ui-react";

<Button>Save</Button>
<Button variant="outline">Cancel</Button>`,
    vue: `<script setup>
import { Button } from "@kimak/ui-vue";
</script>

<template>
  <Button>Save</Button>
  <Button variant="outline">Cancel</Button>
</template>`,
    svelte: `<script>
  import { Button } from "@kimak/ui-svelte";
</script>

<Button>Save</Button>
<Button variant="outline">Cancel</Button>`,
  },
  variants: {
    react: `<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`,
    vue: `<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`,
    svelte: `<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`,
  },
  sizes: {
    react: `<Button size="xs">XS</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
    vue: `<Button size="xs">XS</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
    svelte: `<Button size="xs">XS</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
  },
  icons: {
    react: `import { ChevronRight, Save, Settings } from "lucide-react";

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
</Button>`,
    vue: `<script setup>
import { ChevronRight, Save, Settings } from "@lucide/vue";
</script>

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
</Button>`,
    svelte: `<script>
  import Save from "@lucide/svelte/icons/save";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Settings from "@lucide/svelte/icons/settings";
</script>

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
</Button>`,
  },
  loading: {
    react: `<Button loading>Saving</Button>

function LoadingButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      onPress={() => {
        setLoading(true);
        window.setTimeout(() => setLoading(false), 1200);
      }}
    >
      Save
    </Button>
  );
}`,
    vue: `<script setup>
import { ref } from "vue";

const loading = ref(false);

function onSave() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 1200);
}
</script>

<Button loading>Saving</Button>
<Button :loading="loading" :on-press="onSave">Save</Button>`,
    svelte: `<script>
  let loading = $state(false);

  function onSave() {
    loading = true;
    window.setTimeout(() => {
      loading = false;
    }, 1200);
  }
</script>

<Button loading>Saving</Button>
<Button {loading} onPress={onSave}>Save</Button>`,
  },
  link: {
    react: `import { buttonAttrs } from "@kimak/ui-react";

<a href="/docs/getting-started" {...buttonAttrs({ variant: "outline" })}>
  Get started
</a>`,
    vue: `<script setup>
import { buttonAttrs } from "@kimak/ui-vue";

const look = buttonAttrs({ variant: "outline" });
</script>

<a href="/docs/getting-started" v-bind="look">Get started</a>`,
    svelte: `<script>
  import { buttonAttrs } from "@kimak/ui-svelte";

  const look = buttonAttrs({ variant: "outline" });
</script>

<a href="/docs/getting-started" {...look}>Get started</a>`,
  },
} as const satisfies Record<
  ButtonExample,
  { react: string; vue: string; svelte: string }
>;
