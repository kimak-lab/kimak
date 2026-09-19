export const buttonSnippets = {
  react: `import { Button } from "@kimak/ui-react";

<Button data-variant="outline" data-size="sm">
  Save
</Button>`,
  vue: `<script setup>
import { Button } from "@kimak/ui-vue";
</script>

<template>
  <Button data-variant="outline" data-size="sm">Save</Button>
</template>`,
  svelte: `<script>
  import { Button } from "@kimak/ui-svelte";
</script>

<Button data-variant="outline" data-size="sm">Save</Button>`,
} as const;
