import { getResourceTypeTitle } from "@/config/resourceTypes";
import { isUuid } from "@/utils/displayValue";
import { formatDateTime } from "@/utils/format";

const GENERIC_OBJECT_REPR_RE =
  /^.+ object \([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\)$/i;

/** Prefer API-resolved label; hide Django default "Model object (uuid)". */
export function getAuditRecordLabel(row) {
  const resolved = row?.display_object_repr?.trim();
  if (resolved) return resolved;

  const stored = row?.object_repr?.trim();
  if (!stored) return null;
  if (GENERIC_OBJECT_REPR_RE.test(stored)) return null;
  if (isUuid(stored)) return null;
  return stored;
}

export const ACTION_COLORS = {
  create: "success",
  update: "info",
  delete: "error",
  login: "primary",
  logout: "default",
  custom: "warning",
};

const HIDDEN_SNAPSHOT_FIELDS = new Set([
  "id",
  "deleted_by",
  "deleted_at",
  "is_deleted",
  "password",
]);

/** Audit metadata shown first in create snapshots. */
const SNAPSHOT_FIELD_PRIORITY = [
  "created_at",
  "created_by",
  "updated_at",
  "updated_by",
];

const DATETIME_FIELD_KEYS = new Set(["created_at", "updated_at", "deleted_at"]);

function isDateTimeField(field) {
  if (!field) return false;
  if (DATETIME_FIELD_KEYS.has(field)) return true;
  return field.endsWith("_at") || field.endsWith("_date") || field.startsWith("date_");
}

function looksLikeIsoDateTime(value) {
  if (typeof value !== "string" || value.length < 10) return false;
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return false;
  return !Number.isNaN(new Date(value).getTime());
}

/** Turn `pickup_status` → `Pickup status` when no i18n key exists */
export function humanizeFieldKey(field, t) {
  if (!field || field === "snapshot") return "";
  return t(`audit.fields.${field}`, {
    defaultValue: field
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  });
}

export function getAuditActionLabel(row, t) {
  const customName = row?.metadata?.action_name;
  if (row?.action === "custom" && customName) {
    return t(`audit.customActions.${customName}`, {
      defaultValue: customName.replace(/_/g, " "),
    });
  }
  return t(`audit.actions.${row?.action}`, { defaultValue: row?.action ?? "—" });
}

export function formatAuditFieldValue(field, value, t, locale) {
  if (value === null || value === undefined || value === "") {
    return t("audit.emptyValue");
  }
  if (typeof value === "boolean") {
    return value ? t("common.yes") : t("common.no");
  }
  if (
    (isDateTimeField(field) || looksLikeIsoDateTime(value)) &&
    (typeof value === "string" || value instanceof Date)
  ) {
    return formatAuditDateTime(value, locale);
  }
  if (field && (field.includes("status") || field.endsWith("_status"))) {
    return t(`statuses.${value}`, { defaultValue: String(value) });
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

/**
 * Normalized change rows for UI: { field, fieldKey, old, new, kind: 'change'|'added'|'removed'|'info' }
 * @param {{ maxSnapshotFields?: number | null }} [options]
 *   maxSnapshotFields: cap for create snapshots (default 16). Pass null for no limit.
 */
export function parseAuditChanges(changes, t, locale, options = {}) {
  if (!changes || typeof changes !== "object") return [];
  const maxSnapshotFields =
    options.maxSnapshotFields === undefined ? 16 : options.maxSnapshotFields;

  if (changes.snapshot && typeof changes.snapshot === "object") {
    const entries = Object.entries(changes.snapshot).filter(
      ([key]) => !HIDDEN_SNAPSHOT_FIELDS.has(key)
    );
    entries.sort(([a], [b]) => {
      const ai = SNAPSHOT_FIELD_PRIORITY.indexOf(a);
      const bi = SNAPSHOT_FIELD_PRIORITY.indexOf(b);
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      }
      return a.localeCompare(b);
    });
    const limited =
      maxSnapshotFields == null ? entries : entries.slice(0, maxSnapshotFields);
    return limited.map(([fieldKey, value]) => ({
        fieldKey,
        field: humanizeFieldKey(fieldKey, t),
        old: null,
        new: formatAuditFieldValue(fieldKey, value, t, locale),
        kind: "added",
      }));
  }

  return Object.entries(changes)
    .filter(([key]) => key !== "snapshot")
    .map(([fieldKey, diff]) => {
      if (diff && typeof diff === "object" && ("old" in diff || "new" in diff)) {
        return {
          fieldKey,
          field: humanizeFieldKey(fieldKey, t),
          old: formatAuditFieldValue(fieldKey, diff.old, t, locale),
          new: formatAuditFieldValue(fieldKey, diff.new, t, locale),
          kind: "change",
        };
      }
      return {
        fieldKey,
        field: humanizeFieldKey(fieldKey, t),
        old: null,
        new: formatAuditFieldValue(fieldKey, diff, t, locale),
        kind: "info",
      };
    });
}

export function summarizeAuditChanges(changes, t, locale, maxItems = 2) {
  const items = parseAuditChanges(changes, t, locale);
  if (!items.length) return t("audit.noChanges");

  if (changes?.snapshot) {
    const preview = items
      .slice(0, maxItems)
      .map((i) => `${i.field}: ${i.new}`)
      .join(" · ");
    return items.length > maxItems
      ? `${t("audit.recordCreated")} — ${preview}…`
      : `${t("audit.recordCreated")} — ${preview}`;
  }

  const parts = items.slice(0, maxItems).map((item) => {
    if (item.kind === "change") {
      return `${item.field}: ${item.old} → ${item.new}`;
    }
    return `${item.field}: ${item.new}`;
  });
  const suffix = items.length > maxItems ? "…" : "";
  return parts.join(" · ") + suffix;
}

export function buildAuditHeadline(row, t) {
  const actionLabel = getAuditActionLabel(row, t);
  const resource = getResourceTypeTitle(row.model_name, t);
  const item = getAuditRecordLabel(row);

  if (row.action === "login") return t("audit.headlines.login");
  if (row.action === "logout") return t("audit.headlines.logout");

  if (row.action === "create") {
    return item
      ? t("audit.headlines.create", { resource, item })
      : t("audit.headlines.createNoItem", { resource });
  }
  if (row.action === "delete") {
    return item
      ? t("audit.headlines.delete", { resource, item })
      : t("audit.headlines.deleteNoItem", { resource });
  }
  if (row.action === "update") {
    return item
      ? t("audit.headlines.update", { resource, item })
      : t("audit.headlines.updateNoItem", { resource });
  }
  if (row.action === "custom") {
    return item
      ? t("audit.headlines.custom", { action: actionLabel, resource, item })
      : t("audit.headlines.customNoItem", { action: actionLabel, resource });
  }

  return item
    ? t("audit.headlines.generic", { action: actionLabel, resource, item })
    : t("audit.headlines.genericNoItem", { action: actionLabel, resource });
}

export function formatAuditDateTime(iso) {
  return formatDateTime(iso);
}
