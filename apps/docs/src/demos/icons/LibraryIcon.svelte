<script lang="ts">
  import LucideSave from "@lucide/svelte/icons/save";
  import LucideChevronRight from "@lucide/svelte/icons/chevron-right";
  import LucideSettings from "@lucide/svelte/icons/settings";
  import IconDeviceFloppy from "@tabler/icons-svelte/icons/device-floppy";
  import IconChevronRight from "@tabler/icons-svelte/icons/chevron-right";
  import IconSettings from "@tabler/icons-svelte/icons/settings";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { ArrowRight01Icon, FloppyDiskIcon, Settings01Icon } from "@hugeicons/core-free-icons";
  import FloppyDiskPh from "phosphor-svelte/lib/FloppyDiskIcon";
  import CaretRightIcon from "phosphor-svelte/lib/CaretRightIcon";
  import GearIcon from "phosphor-svelte/lib/GearIcon";
  import RiSaveLine from "svelte-remixicon/RiSaveLine.svelte";
  import RiArrowRightSLine from "svelte-remixicon/RiArrowRightSLine.svelte";
  import RiSettings3Line from "svelte-remixicon/RiSettings3Line.svelte";
  import type { IconLibrary } from "../../lib/icon-libraries";

  type IconRole = "save" | "next" | "settings";

  let {
    library,
    role,
    ...rest
  }: { library: IconLibrary; role: IconRole; [key: string]: unknown } = $props();

  const sets: Record<Exclude<IconLibrary, "hugeicons">, Record<IconRole, any>> = {
    lucide: { save: LucideSave, next: LucideChevronRight, settings: LucideSettings },
    tabler: { save: IconDeviceFloppy, next: IconChevronRight, settings: IconSettings },
    phosphor: { save: FloppyDiskPh, next: CaretRightIcon, settings: GearIcon },
    remix: { save: RiSaveLine, next: RiArrowRightSLine, settings: RiSettings3Line },
  };

  const huge = { save: FloppyDiskIcon, next: ArrowRight01Icon, settings: Settings01Icon };
</script>

{#if library === "hugeicons"}
  <HugeiconsIcon icon={huge[role]} {...rest} />
{:else}
  {@const Icon = sets[library][role]}
  <Icon {...rest} />
{/if}
