<script lang="ts">
  import { Button } from "@kimak/ui-svelte";

  let loading = $state(false);

  function onSave() {
    loading = true;
    window.setTimeout(() => {
      loading = false;
    }, 1200);
  }
</script>

<main>
  <p class="eyebrow text-muted-foreground">Kimak playground (Svelte)</p>
  <h1>Headless Button</h1>
  <p class="text-muted-foreground">
    Product API comes from <code>@kimak/ui-svelte</code>. Parts come from
    <code>@kimak/headless-svelte</code>. Look comes from
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
    </div>
  </section>
</main>
