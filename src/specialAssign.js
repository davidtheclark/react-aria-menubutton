export default function specialAssign(a, b, reserved = {}) {
  // This will get id, className, style, etc.

  Object.keys(b).forEach((key) => {
    if (!reserved[key]) {
      // eslint-disable-next-line no-param-reassign
      a[key] = b[key];
    }
  });
}
