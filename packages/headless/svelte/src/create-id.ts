let count = 0;

export function createKimakId(): string {
  count += 1;
  return `kimak-${count}`;
}
