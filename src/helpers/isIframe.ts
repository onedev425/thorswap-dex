export function isIframe() {
  try {
    return window.self !== window.top;
  } catch (_e) {
    return true;
  }
}
