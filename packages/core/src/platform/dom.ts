export function getOwnerDocument(getRootNode?: () => Document | ShadowRoot): Document {
  const root = getRootNode?.();
  if (typeof Document !== "undefined" && root instanceof Document) return root;
  if (root && "ownerDocument" in root && root.ownerDocument) {
    return root.ownerDocument;
  }
  return document;
}
