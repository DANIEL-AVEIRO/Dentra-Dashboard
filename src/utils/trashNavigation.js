import { trashResources } from "@/config/trash";

/** First URL segment → trash resource filter id */
const ROUTE_TO_TRASH_RESOURCE = {
  users: "users",
  roles: "roles",
  plans: "plans",
  laboratories: "laboratories",
  "my-laboratory": "laboratories",
  "lab-users": "users",
  cases: "cases",
  clinics: "clinics",
  dentists: "dentists",
};

const TRASH_RESOURCE_IDS = new Set(trashResources.map((r) => r.id));

export function trashResourceIdFromPathname(pathname = "") {
  const segment = pathname.replace(/^\/+|\/+$/g, "").split("/")[0] || "";
  if (!segment || segment === "trash") return null;

  const resourceId = ROUTE_TO_TRASH_RESOURCE[segment];
  if (resourceId && TRASH_RESOURCE_IDS.has(resourceId)) {
    return resourceId;
  }
  return null;
}

/** Resolve trash filter id from explicit prop or list API endpoint. */
export function resolveTrashResourceId({ endpoint, trashResourceId } = {}) {
  if (trashResourceId && TRASH_RESOURCE_IDS.has(trashResourceId)) {
    return trashResourceId;
  }
  if (endpoint && TRASH_RESOURCE_IDS.has(endpoint)) {
    return endpoint;
  }
  return null;
}

export function buildTrashUrl(resourceId) {
  if (!resourceId || !TRASH_RESOURCE_IDS.has(resourceId)) {
    return "/trash";
  }
  return `/trash?resource=${encodeURIComponent(resourceId)}`;
}

/** Trash link for sidebar / toolbar — uses current page context when possible. */
export function trashUrlFromContext({ pathname, endpoint, trashResourceId } = {}) {
  return buildTrashUrl(
    resolveTrashResourceId({ endpoint, trashResourceId }) ??
      trashResourceIdFromPathname(pathname)
  );
}
