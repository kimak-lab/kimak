<script lang="ts">
  let dialogOpen = $state(false);
</script>

<main>
  <p class="eyebrow text-muted-foreground">Kimak playground (Svelte)</p>
  <h1>Adapter scaffold</h1>
  <p class="text-muted-foreground">
    Svelte headless parts are scaffolded in <code>@kimak/headless-svelte</code>. This page uses raw
    anatomy <code>data-*</code> attributes styled by <code>@plugin "@kimak/tailwind"</code> until
    Button, Checkbox, and Dialog land in the Svelte adapter.
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
          <span data-scope="button" data-slot="indicator" data-loading></span>
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
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label data-scope="checkbox" data-slot="root" data-size="sm">
        <span data-scope="checkbox" data-slot="control" data-state="unchecked"></span>
        <span data-scope="checkbox" data-slot="indicator" data-state="unchecked"></span>
        <span data-scope="checkbox" data-slot="label">Small</span>
        </label>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label data-scope="checkbox" data-slot="root" data-size="md">
        <span data-scope="checkbox" data-slot="control" data-state="checked"></span>
        <span data-scope="checkbox" data-slot="indicator" data-state="checked"></span>
        <span data-scope="checkbox" data-slot="label">Checked</span>
        </label>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label data-scope="checkbox" data-slot="root" data-size="lg">
        <span data-scope="checkbox" data-slot="control" data-state="indeterminate"></span>
        <span data-scope="checkbox" data-slot="indicator" data-state="indeterminate"></span>
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
      onclick={() => {
        dialogOpen = true;
      }}
    >
      Open dialog
    </button>

    {#if dialogOpen}
      <div class="dialog-layer">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          data-scope="dialog"
          data-slot="backdrop"
          data-state="open"
          onclick={() => {
            dialogOpen = false;
          }}
        ></div>
        <div data-scope="dialog" data-slot="positioner">
          <div data-scope="dialog" data-slot="content" data-state="open" data-size="md">
            <h3 data-scope="dialog" data-slot="title">Styled by the Tailwind plugin</h3>
            <p data-scope="dialog" data-slot="description">
              Svelte adapter scaffold is live. Full Dialog port adds portal, focus trap, and dismiss.
            </p>
            <button
              type="button"
              data-scope="dialog"
              data-slot="close"
              onclick={() => {
                dialogOpen = false;
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    {/if}
  </section>
</main>
