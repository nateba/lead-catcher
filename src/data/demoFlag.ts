const KEY = 'hypeleads_demo_enabled_v1';

/** Whether the demo/preview tabs are available in this browser. */
export function isDemoEnabled(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export const DEMO_FLAG_EVENT = 'hypeleads:demo-flag';

export function setDemoEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(KEY, enabled ? '1' : '0');
  } catch {
    /* private mode: the flag simply stays off */
  }
  // `storage` only fires in other tabs, so notify this one explicitly.
  window.dispatchEvent(new CustomEvent(DEMO_FLAG_EVENT));
}
