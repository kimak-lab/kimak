import { getCurrentInstance, useId } from "vue";

let count = 0;

/**
 * Stable id for a component instance. Inside `setup()` it uses Vue `useId()`,
 * so server and client agree during hydration, and `app.config.idPrefix`
 * keeps ids unique across apps (e.g. one Astro island per app).
 */
export function createKimakId(): string {
  if (getCurrentInstance()) return `kimak-${useId()}`;
  count += 1;
  return `kimak-${count}`;
}
