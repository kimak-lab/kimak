import { resetDismissStack } from "@kimak/core";
import { config } from "@vue/test-utils";
import { afterEach } from "vitest";

config.global.stubs = {};

afterEach(() => {
  resetDismissStack();
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
});
