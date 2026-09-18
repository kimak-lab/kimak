import { createNormalizer, type Dict } from "@kimak/core";

export interface VuePropTypes {
  element: Record<string, unknown>;
  button: Record<string, unknown>;
  label: Record<string, unknown>;
  input: Record<string, unknown>;
}

function remapReactDialect(props: Dict): Dict {
  const next: Dict = { ...props };

  if ("htmlFor" in next) {
    next.for = next.htmlFor;
    delete next.htmlFor;
  }

  if ("className" in next) {
    next.class = next.className;
    delete next.className;
  }

  return next;
}

export const normalizeProps = createNormalizer<VuePropTypes>(remapReactDialect);
