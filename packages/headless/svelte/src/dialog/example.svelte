<script lang="ts">
  import { Dialog } from "./index";

  let {
    role,
    defaultOpen = false,
  }: {
    role?: "dialog" | "alertdialog";
    defaultOpen?: boolean;
  } = $props();
</script>

<Dialog.Root {role} {defaultOpen}>
  <Dialog.Trigger data-testid="open">Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>Make changes below.</Dialog.Description>
        <button type="button">First</button>
        <button type="button">Last</button>
        <Dialog.Close>Done</Dialog.Close>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Portal>
</Dialog.Root>
