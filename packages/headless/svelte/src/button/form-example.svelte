<script lang="ts">
  import { Button } from "./index";

  let {
    loading = false,
    onSubmit,
  }: {
    loading?: boolean;
    onSubmit?: () => void;
  } = $props();
</script>

<form
  onsubmit={(event) => {
    event.preventDefault();
    onSubmit?.();
  }}
>
  <input name="title" value="hello" />
  <Button.Root type="submit" {loading}>
    Save
    <Button.Indicator />
  </Button.Root>
</form>
