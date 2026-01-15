globalThis.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return window.setTimeout(callback, 0);
};
