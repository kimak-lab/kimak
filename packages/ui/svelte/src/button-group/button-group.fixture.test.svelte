<script lang="ts">
  import { Button } from "../button";
  import ButtonGroup from "./button-group.svelte";
  import ButtonGroupSeparator from "./button-group-separator.svelte";
  import ButtonGroupText from "./button-group-text.svelte";
</script>

<ButtonGroup aria-label="Text alignment" class="group-save">
  <Button>Left</Button>
  <ButtonGroupSeparator />
  <Button>Right</Button>
</ButtonGroup>
<ButtonGroup role="toolbar" aria-label="Formatting" orientation="vertical">
  <ButtonGroupSeparator orientation="horizontal" data-testid="horizontal" />
</ButtonGroup>
<ButtonGroupText>https://</ButtonGroupText>
<ButtonGroupText as="label" for="url">URL</ButtonGroupText>
<input id="url" />
