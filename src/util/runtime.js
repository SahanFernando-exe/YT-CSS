globalThis.runtime ??= globalThis?.browser?.runtime || globalThis?.chrome?.runtime;

export function getURL(path) {
  return runtime.getURL(path);
}