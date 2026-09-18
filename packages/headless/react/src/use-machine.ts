"use client";

import { useRef, useSyncExternalStore } from "react";
import type { Service } from "@kimak/core";

export function useMachine<TContext, TProps, TEvent extends { type: string }>(
  create: (props: TProps) => Service<TContext, TProps, TEvent>,
  props: TProps,
): Service<TContext, TProps, TEvent> {
  const serviceRef = useRef<Service<TContext, TProps, TEvent> | null>(null);
  if (!serviceRef.current) {
    serviceRef.current = create(props);
  }
  const service = serviceRef.current;
  service.setProps(props);

  useSyncExternalStore(service.subscribe, service.getSnapshot, service.getSnapshot);
  return service;
}
