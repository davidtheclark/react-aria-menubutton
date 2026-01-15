export default function specialAssign(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  reserved?: Record<string, unknown>
): void {
  const reservedKeys = reserved ?? {};
  // This will get id, className, style, etc.
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    if (reservedKeys[key]) continue;
    target[key] = source[key];
  }
}
