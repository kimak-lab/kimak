<script lang="ts">
  import { buttonAttrs, Popover } from "@kimak/ui-svelte";
  import type { PopoverExample } from "../../lib/snippets/popover";

  let { example = "basic" }: { example?: PopoverExample } = $props();

  const sides = ["top", "right", "bottom", "left"] as const;
  let open = $state(false);
</script>

<div class="flex flex-wrap items-center gap-3">
  {#if example === "basic"}
    <Popover>
      <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>Open popover</Popover.Trigger>
      <Popover.Content class="w-72">
        <Popover.Title>Dimensions</Popover.Title>
        <Popover.Description>Set the dimensions for the layer.</Popover.Description>
        <div class="mt-3 flex justify-end">
          <Popover.Close {...buttonAttrs({ size: "sm" })}>Done</Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
  {:else if example === "sides"}
    {#each sides as side (side)}
      <Popover {side}>
        <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>{side}</Popover.Trigger>
        <Popover.Content>
          <p class="m-0 text-sm">Placed on the {side}.</p>
        </Popover.Content>
      </Popover>
    {/each}
  {:else if example === "controlled"}
    <Popover bind:open>
      <Popover.Trigger {...buttonAttrs({ variant: "outline" })}>{open ? "Close" : "Open"}</Popover.Trigger>
      <Popover.Content>
        <button type="button" {...buttonAttrs({ size: "sm" })} onclick={() => (open = false)}>
          Close from content
        </button>
      </Popover.Content>
    </Popover>
  {/if}
</div>
