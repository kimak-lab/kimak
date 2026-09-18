import { resetDismissStack } from "@kimak/core";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  resetDismissStack();
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
});
