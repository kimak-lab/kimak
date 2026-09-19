<script lang="ts">
  import { Button } from "./index";

  let {
    disabled,
    loading,
    focusableWhenDisabled,
    type,
    onPress,
    name,
    value,
    class: className,
    "data-size": dataSize,
  }: {
    disabled?: boolean;
    loading?: boolean;
    focusableWhenDisabled?: boolean;
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
  {focusableWhenDisabled}
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
