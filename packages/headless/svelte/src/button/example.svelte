<script lang="ts">
  import { Button } from "./index";

  let {
    disabled,
    loading,
    type,
    onPress,
    name,
    value,
    class: className,
    "data-size": dataSize,
  }: {
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
    onPress?: () => void;
    name?: string;
    value?: string;
    class?: string;
    "data-size"?: string;
  } = $props();
</script>

<Button.Root
  {disabled}
  {loading}
  {type}
  {onPress}
  {name}
  {value}
  class={className}
  data-size={dataSize}
>
  Save
  <Button.Indicator class="btn-spin" />
</Button.Root>
