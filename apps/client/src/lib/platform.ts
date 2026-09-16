export function getShortcutKey(): string {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "Ctrl+K"
  }
  const platform =
    (navigator as any)?.userAgentData?.platform ||
    navigator?.platform ||
    navigator?.userAgent ||
    ""
  const isMac = /mac|iphone|ipad|ipod/i.test(platform)
  return isMac ? "⌘K" : "Ctrl+K"
}
