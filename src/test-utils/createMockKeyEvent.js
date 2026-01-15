export default function(key, keyCode) {
  return {
    key: key,
    keyCode: keyCode,
    preventDefault: vi.fn()
  };
}
