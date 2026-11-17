<script setup lang="ts">
import { computed, type Component } from "vue";
import { ChevronRight, Save, Settings } from "@lucide/vue";
import { IconChevronRight, IconDeviceFloppy, IconSettings } from "@tabler/icons-vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import { ArrowRight01Icon, FloppyDiskIcon, Settings01Icon } from "@hugeicons/core-free-icons";
import { PhCaretRight, PhFloppyDisk, PhGear } from "@phosphor-icons/vue";
import { RiArrowRightSLine, RiSaveLine, RiSettings3Line } from "./remix-vue";
import type { IconLibrary } from "../../lib/icon-libraries";

type IconRole = "save" | "next" | "settings";

const props = defineProps<{ library: IconLibrary; role: IconRole }>();

const sets: Record<Exclude<IconLibrary, "hugeicons">, Record<IconRole, Component>> = {
  lucide: { save: Save, next: ChevronRight, settings: Settings },
  tabler: { save: IconDeviceFloppy, next: IconChevronRight, settings: IconSettings },
  phosphor: { save: PhFloppyDisk, next: PhCaretRight, settings: PhGear },
  remix: { save: RiSaveLine, next: RiArrowRightSLine, settings: RiSettings3Line },
};

const huge = { save: FloppyDiskIcon, next: ArrowRight01Icon, settings: Settings01Icon };

const icon = computed(() => (props.library === "hugeicons" ? null : sets[props.library][props.role]));
</script>

<template>
  <HugeiconsIcon v-if="props.library === 'hugeicons'" :icon="huge[props.role]" />
  <component :is="icon" v-else />
</template>
