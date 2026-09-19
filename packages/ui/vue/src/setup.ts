import { resetDismissStack } from "@kimak/core";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

if (typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    }) as MediaQueryList;
}

afterEach(() => {
  resetDismissStack();
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
});
