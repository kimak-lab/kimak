import type { ComponentType, SVGProps } from "react";
import { ChevronRight, Save, Settings } from "lucide-react";
import { IconChevronRight, IconDeviceFloppy, IconSettings } from "@tabler/icons-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, FloppyDiskIcon, Settings01Icon } from "@hugeicons/core-free-icons";
import { CaretRightIcon, FloppyDiskIcon as PhFloppyDisk, GearIcon } from "@phosphor-icons/react";
import { RiArrowRightSLine, RiSaveLine, RiSettings3Line } from "@remixicon/react";
import type { IconLibrary } from "../../lib/icon-libraries";

export type IconRole = "save" | "next" | "settings";

type IconProps = SVGProps<SVGSVGElement> & { "data-icon"?: string };
type IconComponent = ComponentType<IconProps>;
type ComponentLibrary = Exclude<IconLibrary, "hugeicons">;

const sets: Record<ComponentLibrary, Record<IconRole, IconComponent>> = {
  lucide: { save: Save, next: ChevronRight, settings: Settings } as Record<IconRole, IconComponent>,
  tabler: {
    save: IconDeviceFloppy,
    next: IconChevronRight,
    settings: IconSettings,
  } as Record<IconRole, IconComponent>,
  phosphor: { save: PhFloppyDisk, next: CaretRightIcon, settings: GearIcon } as Record<
    IconRole,
    IconComponent
  >,
  remix: { save: RiSaveLine, next: RiArrowRightSLine, settings: RiSettings3Line } as Record<
    IconRole,
    IconComponent
  >,
};

const huge = { save: FloppyDiskIcon, next: ArrowRight01Icon, settings: Settings01Icon };

/** One demo icon from the selected library. Extra props reach the `<svg>`. */
export function LibraryIcon({
  library,
  role,
  ...props
}: IconProps & { library: IconLibrary; role: IconRole }) {
  if (library === "hugeicons") {
    return <HugeiconsIcon icon={huge[role]} {...(props as Record<string, unknown>)} />;
  }
  const Icon = sets[library][role];
  return <Icon {...props} />;
}
