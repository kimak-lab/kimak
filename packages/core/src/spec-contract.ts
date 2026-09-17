import type { PartContract } from "@kimak/spec";

export function dataAttrKeys(props: Record<string, unknown>): string[] {
  return Object.keys(props)
    .filter((key) => key.startsWith("data-"))
    .sort();
}

export function expectedDataAttrKeys(part: PartContract): string[] {
  return ["data-scope", "data-slot", ...part.dataAttrs].sort();
}

export function machineParts(parts: object): Array<[string, PartContract]> {
  return Object.entries(parts as Record<string, PartContract>).filter(
    ([, part]) => part.owner !== "adapter",
  );
}
