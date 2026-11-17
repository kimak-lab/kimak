import { ICON_LIBRARIES, type IconLibrary } from "../icon-libraries";
import { FRAMEWORKS, type Framework } from "../nav";

/** The three demo icons, in the order the snippet uses them. */
type IconRole = "save" | "next" | "settings";

interface LibrarySource {
  /** `import` lines for this framework. */
  imports: string;
  /** Component names per role. For Hugeicons these are icon data, not components. */
  names: Record<IconRole, string>;
  /** Hugeicons renders `<HugeiconsIcon icon={...} />` instead of one component per icon. */
  wrapper?: "HugeiconsIcon";
}

function named(names: Record<IconRole, string>, from: string): string {
  const sorted = [names.next, names.save, names.settings].sort();
  return `import { ${sorted.join(", ")} } from "${from}";`;
}

function perFile(names: Record<IconRole, string>, path: (name: string, role: IconRole) => string): string {
  const roles: IconRole[] = ["save", "next", "settings"];
  return roles.map((role) => `import ${names[role]} from "${path(names[role], role)}";`).join("\n");
}

const lucide = { save: "Save", next: "ChevronRight", settings: "Settings" };
const lucideFiles: Record<IconRole, string> = { save: "save", next: "chevron-right", settings: "settings" };
const tabler = { save: "IconDeviceFloppy", next: "IconChevronRight", settings: "IconSettings" };
const tablerFiles: Record<IconRole, string> = {
  save: "device-floppy",
  next: "chevron-right",
  settings: "settings",
};
const huge = { save: "FloppyDiskIcon", next: "ArrowRight01Icon", settings: "Settings01Icon" };
const phosphor = { save: "FloppyDiskIcon", next: "CaretRightIcon", settings: "GearIcon" };
const phosphorVue = { save: "PhFloppyDisk", next: "PhCaretRight", settings: "PhGear" };
const remix = { save: "RiSaveLine", next: "RiArrowRightSLine", settings: "RiSettings3Line" };

function hugeImports(adapter: string): string {
  return `import { HugeiconsIcon } from "${adapter}";\n${named(huge, "@hugeicons/core-free-icons")}`;
}

function source(library: IconLibrary, framework: Framework): LibrarySource {
  switch (library) {
    case "lucide":
      return {
        react: { imports: named(lucide, "lucide-react"), names: lucide },
        vue: { imports: named(lucide, "@lucide/vue"), names: lucide },
        svelte: {
          imports: perFile(lucide, (_, role) => `@lucide/svelte/icons/${lucideFiles[role]}`),
          names: lucide,
        },
      }[framework];
    case "tabler":
      return {
        react: { imports: named(tabler, "@tabler/icons-react"), names: tabler },
        vue: { imports: named(tabler, "@tabler/icons-vue"), names: tabler },
        svelte: {
          imports: perFile(tabler, (_, role) => `@tabler/icons-svelte/icons/${tablerFiles[role]}`),
          names: tabler,
        },
      }[framework];
    case "hugeicons":
      return { imports: hugeImports(`@hugeicons/${framework}`), names: huge, wrapper: "HugeiconsIcon" };
    case "phosphor":
      return {
        react: { imports: named(phosphor, "@phosphor-icons/react"), names: phosphor },
        vue: { imports: named(phosphorVue, "@phosphor-icons/vue"), names: phosphorVue },
        svelte: { imports: perFile(phosphor, (name) => `phosphor-svelte/lib/${name}`), names: phosphor },
      }[framework];
    case "remix":
      return {
        react: { imports: named(remix, "@remixicon/react"), names: remix },
        vue: { imports: named(remix, "@remixicon/vue"), names: remix },
        svelte: { imports: perFile(remix, (name) => `svelte-remixicon/${name}.svelte`), names: remix },
      }[framework];
    default: {
      const exhaustive: never = library;
      throw new Error(`Unhandled icon library ${String(exhaustive)}`);
    }
  }
}

function icon(src: LibrarySource, framework: Framework, role: IconRole, attrs: string): string {
  const name = src.names[role];
  const tail = attrs ? ` ${attrs}` : "";
  if (!src.wrapper) return `<${name}${tail} />`;
  const binding = framework === "vue" ? `:icon="${name}"` : `icon={${name}}`;
  return `<${src.wrapper} ${binding}${tail} />`;
}

function body(src: LibrarySource, framework: Framework): string {
  const start = icon(src, framework, "save", 'data-icon="inline-start" aria-hidden="true"');
  const end = icon(src, framework, "next", 'data-icon="inline-end" aria-hidden="true"');
  const only = icon(src, framework, "settings", 'aria-hidden="true"');
  return `<Button>
  ${start}
  Save
</Button>
<Button variant="outline">
  Next
  ${end}
</Button>
<Button size="icon" aria-label="Settings">
  ${only}
</Button>`;
}

/** Button-with-icons snippet for one framework and icon library. */
export function iconSnippet(framework: Framework, library: IconLibrary): string {
  const src = source(library, framework);
  switch (framework) {
    case "react":
      return `${src.imports}\n\n${body(src, framework)}`;
    case "vue":
      return `<script setup>\n${src.imports}\n</script>\n\n${body(src, framework)}`;
    case "svelte": {
      const imports = src.imports
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n");
      return `<script>\n${imports}\n</script>\n\n${body(src, framework)}`;
    }
    default: {
      const exhaustive: never = framework;
      throw new Error(`Unhandled framework ${String(exhaustive)}`);
    }
  }
}

export type FrameworkSnippets = Record<Framework, string>;

export type LibrarySnippets = Record<IconLibrary, FrameworkSnippets>;

export function iconSnippetsByLibrary(): LibrarySnippets {
  const result = {} as LibrarySnippets;
  for (const library of ICON_LIBRARIES) {
    const perFramework = {} as FrameworkSnippets;
    for (const framework of FRAMEWORKS) perFramework[framework] = iconSnippet(framework, library);
    result[library] = perFramework;
  }
  return result;
}
