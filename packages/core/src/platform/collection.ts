export interface CollectionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Collection<T extends CollectionItem> {
  items: T[];
  getItem: (value: string) => T | undefined;
  getValues: () => string[];
  search: (query: string) => T[];
}

export function createCollection<T extends CollectionItem>(items: T[]): Collection<T> {
  const byValue = new Map(items.map((item) => [item.value, item]));
  return {
    items,
    getItem: (value) => byValue.get(value),
    getValues: () => items.map((item) => item.value),
    search: (query) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return items;
      return items.filter((item) => item.label.toLowerCase().includes(needle));
    },
  };
}
