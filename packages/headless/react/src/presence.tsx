"use client";

import type { ReactNode } from "react";
import { shouldMount } from "@kimak/core";

export function Presence({
  present,
  forceMount,
  children,
}: {
  present: boolean;
  forceMount?: boolean;
  children: ReactNode;
}) {
  if (!shouldMount({ present, forceMount })) return null;
  return children;
}
