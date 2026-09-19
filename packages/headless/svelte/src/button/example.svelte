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
    as,
    href,
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
    as?: "button" | "a";
    href?: string;
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
  {as}
  {href}
  class={className}
  data-size={dataSize}
>
  Save
  <Button.Indicator class="btn-spin" />
</Button.Root>
