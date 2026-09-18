<script lang="ts">
  import { Checkbox } from "./index";

  let {
    disabled,
    readOnly,
    defaultChecked,
    name,
    value,
  }: {
    disabled?: boolean;
    readOnly?: boolean;
    defaultChecked?: boolean | "indeterminate";
    name?: string;
    value?: string;
  } = $props();
</script>

<Checkbox.Root {disabled} {readOnly} {defaultChecked} {name} {value}>
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label>Accept terms</Checkbox.Label>
  <Checkbox.HiddenInput />
</Checkbox.Root>
