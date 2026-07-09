/** Media base for production. Dev uses Vite /media proxy. */
function getMediaBaseUrl() {
  const configured = import.meta.env.VITE_MEDIA_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const api = import.meta.env.VITE_API_URL?.trim();
  if (api && /^https?:\/\//i.test(api)) {
    try {
      return `${new URL(api).origin}/media`;
    } catch {
      return "";
    }
  }
  return "";
}

function toMediaPath(path) {
  const trimmed = path.trim();

  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      const mediaIdx = u.pathname.indexOf("/media");
      if (mediaIdx === -1) return trimmed;
      const rest = u.pathname.slice(mediaIdx);
      return `${rest}${u.search || ""}`;
    } catch {
      return null;
    }
  }

  if (trimmed.startsWith("/media/")) return trimmed;
  if (trimmed.startsWith("media/")) return `/${trimmed}`;
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed.replace(/^\//, "")}`;
}

function joinMediaBase(base, mediaPath) {
  const suffix = mediaPath.replace(/^\/media\/?/, "").replace(/^\//, "");
  return suffix ? `${base}/${suffix}` : base;
}

export function resolveMediaUrl(path) {
  if (!path || typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed) return null;

  const mediaPath = toMediaPath(trimmed);
  if (!mediaPath) return null;

  if (mediaPath.startsWith("blob:") || mediaPath.startsWith("data:")) {
    return mediaPath;
  }

  const isMedia = mediaPath.startsWith("/media/") || mediaPath === "/media";
  const base = getMediaBaseUrl();

  if (base && isMedia) {
    return joinMediaBase(base, mediaPath);
  }

  if (/^https?:\/\//i.test(mediaPath)) {
    return mediaPath;
  }

  return mediaPath;
}

export function isMediaPathValue(value) {
  if (value == null || typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return false;
  if (v.startsWith("blob:") || v.startsWith("data:")) return true;
  return /\/media\//i.test(v) || /^media\//i.test(v);
}
