<script setup lang="ts">
import { ref } from "vue";
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
  <main>
    <p class="eyebrow text-muted-foreground">Kimak playground (Vue)</p>
    <h1>Headless Button</h1>
    <p class="text-muted-foreground">
      Product API comes from <code>@kimak/ui-vue</code>. Parts come from
      <code>@kimak/headless-vue</code>. Look comes from
      <code>@plugin "@kimak/tailwind"</code> targeting anatomy <code>data-*</code>
      attributes. Recolor with tokens in <code>styles.css</code>.
    </p>

    <section>
      <h2>Button</h2>
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
      </div>
    </section>
  </main>
</template>
