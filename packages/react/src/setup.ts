import { resetDismissStack } from "@kimak/core";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
  resetDismissStack();
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
});
