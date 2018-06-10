module.exports = function(a, b, reserved) {
  reserved = reserved || {};
  // This will get id, className, style, etc.
  for (var x in b) {
    if (!b.hasOwnProperty(x)) continue;
    if (reserved[x]) continue;
    a[x] = b[x];
  }
};
