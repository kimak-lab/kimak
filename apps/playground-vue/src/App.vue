<script setup lang="ts">
import { ref } from "vue";

const dialogOpen = ref(false);
</script>

<template>
  <main>
    <p class="eyebrow text-muted-foreground">Kimak playground (Vue)</p>
    <h1>Adapter scaffold</h1>
    <p class="text-muted-foreground">
      Vue headless parts are scaffolded in <code>@kimak/headless-vue</code>. This page uses raw
      anatomy <code>data-*</code> attributes styled by <code>@plugin "@kimak/tailwind"</code> until
      Button, Checkbox, and Dialog land in the Vue adapter.
    </p>

    <section>
      <h2>Button anatomy</h2>
      <div class="stack">
        <div class="row">
          <button type="button" data-scope="button" data-slot="root" data-size="sm">Small</button>
          <button type="button" data-scope="button" data-slot="root" data-size="md">Medium</button>
          <button type="button" data-scope="button" data-slot="root" data-size="lg">Large</button>
          <button type="button" data-scope="button" data-slot="root" data-disabled>Disabled</button>
          <button type="button" data-scope="button" data-slot="root" data-loading>
            Loading
            <span data-scope="button" data-slot="indicator" data-loading />
          </button>
        </div>
        <div class="row">
          <button type="button" data-scope="button" data-slot="root">Default</button>
          <button type="button" data-scope="button" data-slot="root" data-variant="secondary">
            Secondary
          </button>
          <button type="button" data-scope="button" data-slot="root" data-variant="outline">
            Outline
          </button>
          <button type="button" data-scope="button" data-slot="root" data-variant="ghost">
            Ghost
          </button>
          <button type="button" data-scope="button" data-slot="root" data-variant="destructive">
            Destructive
          </button>
        </div>
      </div>
    </section>

    <section>
      <h2>Checkbox anatomy</h2>
      <div class="stack">
        <label data-scope="checkbox" data-slot="root" data-size="sm">
          <span data-scope="checkbox" data-slot="control" data-state="unchecked" />
          <span data-scope="checkbox" data-slot="indicator" data-state="unchecked" />
          <span data-scope="checkbox" data-slot="label">Small</span>
        </label>
        <label data-scope="checkbox" data-slot="root" data-size="md">
          <span data-scope="checkbox" data-slot="control" data-state="checked" />
          <span data-scope="checkbox" data-slot="indicator" data-state="checked" />
          <span data-scope="checkbox" data-slot="label">Checked</span>
        </label>
        <label data-scope="checkbox" data-slot="root" data-size="lg">
          <span data-scope="checkbox" data-slot="control" data-state="indeterminate" />
          <span data-scope="checkbox" data-slot="indicator" data-state="indeterminate" />
          <span data-scope="checkbox" data-slot="label">Indeterminate</span>
        </label>
      </div>
    </section>

    <section>
      <h2>Dialog anatomy</h2>
      <button
        type="button"
        data-scope="dialog"
        data-slot="trigger"
        @click="dialogOpen = true"
      >
        Open dialog
      </button>

      <div v-if="dialogOpen" class="dialog-layer">
        <div data-scope="dialog" data-slot="backdrop" data-state="open" @click="dialogOpen = false" />
        <div data-scope="dialog" data-slot="positioner">
          <div data-scope="dialog" data-slot="content" data-state="open" data-size="md">
            <h3 data-scope="dialog" data-slot="title">Styled by the Tailwind plugin</h3>
            <p data-scope="dialog" data-slot="description">
              Vue adapter scaffold is live. Full Dialog port adds portal, focus trap, and dismiss.
            </p>
            <button
              type="button"
              data-scope="dialog"
              data-slot="close"
              @click="dialogOpen = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
