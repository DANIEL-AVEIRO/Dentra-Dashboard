import { APP_TITLE } from "@/constants/brand";

/** Optional — set via project.frame.env + sync */
export const SUPPORT_VIBER_NUMBER = "";
export const SUPPORT_CONTACT_LABEL = "";

export function buildErrorSupportMessage(error, { componentStack } = {}) {
  const pagePath =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "—";
  const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent : "—";

  const lines = [
    `${APP_TITLE} Admin — error report`,
    "",
    `Page: ${pagePath}`,
    `Time: ${new Date().toISOString()}`,
    `Error: ${error?.message || String(error || "Unknown error")}`,
    `Browser: ${userAgent}`,
  ];

  const stack = (componentStack || error?.stack || "").trim();
  if (stack) {
    lines.push("", "Details:", stack.slice(0, 1200));
  }

  return lines.join("\n");
}

export function buildViberChatUrl(message, number = SUPPORT_VIBER_NUMBER) {
  const text = encodeURIComponent(message);
  return `viber://chat?number=${number}&text=${text}`;
}

export function buildViberWebUrl(number = SUPPORT_VIBER_NUMBER) {
  return `https://viber.me/${number}`;
}

export async function openViberSupport(message, { onCopied } = {}) {
  if (!SUPPORT_VIBER_NUMBER) return;

  try {
    await navigator.clipboard.writeText(message);
    onCopied?.();
  } catch {
    /* clipboard optional */
  }

  window.location.href = buildViberChatUrl(message);
}
