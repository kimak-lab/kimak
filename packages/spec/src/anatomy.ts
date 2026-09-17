export interface AnatomyPartAttrs {
  "data-scope": string;
  "data-slot": string;
}

export interface AnatomyPart<TSlot extends string> {
  slot: TSlot;
  attrs: () => AnatomyPartAttrs;
  selector: string;
}

export type Anatomy<TName extends string, TParts extends readonly string[]> = {
  name: TName;
  parts: TParts;
} & { [K in TParts[number]]: AnatomyPart<K> };

export function createAnatomy<
  TName extends string,
  const TParts extends readonly string[],
>(name: TName, parts: TParts): Anatomy<TName, TParts> {
  const anatomy = {
    name,
    parts,
  } as Anatomy<TName, TParts>;

  for (const part of parts) {
    (anatomy as Record<string, unknown>)[part] = {
      slot: part,
      attrs: () => ({
        "data-scope": name,
        "data-slot": part,
      }),
      selector: `[data-scope="${name}"][data-slot="${part}"]`,
    };
  }

  return anatomy;
}
