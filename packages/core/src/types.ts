export type Dict = Record<string, unknown>;

export type NormalizeFn = <T extends Dict>(props: T) => T;

export interface PropTypes {
  element: NormalizeFn;
  button: NormalizeFn;
  label: NormalizeFn;
  input: NormalizeFn;
}

export const identityPropTypes: PropTypes = {
  element: (props) => props,
  button: (props) => props,
  label: (props) => props,
  input: (props) => props,
};

export type Direction = "ltr" | "rtl";

export interface CommonProps {
  id?: string;
  dir?: Direction;
  getRootNode?: () => Document | ShadowRoot;
}

export function getCheckedState(
  checked: boolean | "indeterminate",
): "checked" | "unchecked" | "indeterminate" {
  if (checked === "indeterminate") return "indeterminate";
  return checked ? "checked" : "unchecked";
}

export function dataIf(condition: boolean | undefined): "" | undefined {
  return condition ? "" : undefined;
}
