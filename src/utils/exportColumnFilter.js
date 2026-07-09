/** Columns hidden from export picker (all tables). */

const EXPORT_SKIP_KEYS = new Set([
  "id",
  "pk",
  "is_deleted",
  "deleted_at",
  "deleted_by",
  "password",
  "last_login",
  "is_superuser",
  "user_permissions",
  "groups",
]);

const EXPORT_RELATION_KEYS = new Set([
  "user",
  "role",
  "region",
  "township",
  "branch",
  "category",
  "created_by",
  "updated_by",
]);

function isPhotoOrFileKey(key) {
  const k = key.toLowerCase();
  if (k === "profile" || k === "user_profile") return true;
  if (k.endsWith("_photo") || k.endsWith("_image") || k === "photo" || k === "logo") return true;
  if (k === "qr_code" || k === "qr" || k === "image") return true;
  return false;
}

export function shouldExcludeExportColumn(key, context = {}) {
  if (!key || key === "actions") return true;

  const k = key.toLowerCase();
  if (EXPORT_SKIP_KEYS.has(k)) return true;
  if (k.endsWith("_id")) return true;
  if (isPhotoOrFileKey(k)) return true;

  const allKeys = context.allKeys;
  if (allKeys?.has(`${key}_name`) || allKeys?.has(`${key}_display`)) {
    return true;
  }
  if (EXPORT_RELATION_KEYS.has(k)) return true;

  return false;
}

export function filterExportColumns(columns, context = {}) {
  const list = columns || [];
  const allKeys = context.allKeys ?? new Set(list.map((c) => c.key).filter(Boolean));
  const ctx = { allKeys };
  return list.filter((col) => col.key && !shouldExcludeExportColumn(col.key, ctx));
}
