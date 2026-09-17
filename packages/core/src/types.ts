import type { CommonProps as SpecCommonProps, Direction } from "@kimak/spec";

export type Dict = Record<string, unknown>;

export type { Direction };

export interface CommonProps extends SpecCommonProps {
  getRootNode?: () => Document | ShadowRoot;
}

export function dataIf(condition: boolean | undefined): "" | undefined {
  return condition ? "" : undefined;
}
