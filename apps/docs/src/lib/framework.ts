import { isFramework, type Framework } from "./nav";

export const FRAMEWORK_KEY = "kimak.docs.framework";

export const FRAMEWORK_EVENT = "kimak:framework";

export const DEFAULT_FRAMEWORK: Framework = "react";

export const frameworkLabels: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
};

/** Active framework from `<html data-framework>`, set by the inline boot script. */
export function getFramework(): Framework {
  if (typeof document === "undefined") return DEFAULT_FRAMEWORK;
  const value = document.documentElement.dataset.framework;
  return isFramework(value) ? value : DEFAULT_FRAMEWORK;
}

export function getServerFramework(): Framework {
  return DEFAULT_FRAMEWORK;
}

export function setFramework(framework: Framework): void {
  document.documentElement.dataset.framework = framework;
  try {
    localStorage.setItem(FRAMEWORK_KEY, framework);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent(FRAMEWORK_EVENT, { detail: framework }));
}

export function subscribeFramework(listener: () => void): () => void {
  window.addEventListener(FRAMEWORK_EVENT, listener);
  return () => window.removeEventListener(FRAMEWORK_EVENT, listener);
}
