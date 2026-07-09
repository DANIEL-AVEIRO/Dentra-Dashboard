import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const API_DATE_FORMAT = "YYYY-MM-DD";
export const API_TIME_FORMAT = "HH:mm";
export const API_DATETIME_FORMAT = "YYYY-MM-DDTHH:mm";

export const DISPLAY_DATE_FORMAT = "DD/MM/YYYY";
export const DISPLAY_TIME_FORMAT = "HH:mm";
export const DISPLAY_DATETIME_FORMAT = "DD/MM/YYYY, HH:mm";

const TIME_PARSE_FORMATS = [
  API_TIME_FORMAT,
  "HH:mm:ss",
  `${API_DATE_FORMAT} ${API_TIME_FORMAT}`,
  `${API_DATE_FORMAT}T${API_TIME_FORMAT}`,
  `${API_DATE_FORMAT}T${API_TIME_FORMAT}:ss`,
];

const DATETIME_PARSE_FORMATS = [
  API_DATETIME_FORMAT,
  `${API_DATETIME_FORMAT}:ss`,
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss.SSSZ",
  "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
  API_DATE_FORMAT,
];

export function parseDateValue(value) {
  if (value == null || value === "") return null;
  const d = dayjs(String(value), API_DATE_FORMAT, true);
  if (d.isValid()) return d;
  const loose = dayjs(String(value));
  return loose.isValid() ? loose.startOf("day") : null;
}

export function formatDateValue(value) {
  if (!value?.isValid?.()) return "";
  return value.format(API_DATE_FORMAT);
}

export function parseTimeValue(value) {
  if (value == null || value === "") return null;
  const raw = String(value).trim();
  for (const fmt of TIME_PARSE_FORMATS) {
    const d = dayjs(raw, fmt, true);
    if (d.isValid()) return d;
  }
  const iso = dayjs(raw);
  return iso.isValid() ? iso : null;
}

export function formatTimeValue(value) {
  if (!value?.isValid?.()) return "";
  return value.format(API_TIME_FORMAT);
}

/** Check-in / check-out from API (ISO datetime, HH:mm:ss, or HH:mm) → display time. */
export function formatAttendanceTime(value) {
  if (value == null || value === "") return "—";
  const parsed = parseDateTimeValue(value) || parseTimeValue(value);
  if (parsed?.isValid?.()) {
    return parsed.format(DISPLAY_TIME_FORMAT);
  }
  const loose = dayjs(String(value));
  if (loose.isValid()) return loose.format(DISPLAY_TIME_FORMAT);
  const m = String(value).trim().match(/^(\d{1,2}):(\d{2})/);
  if (m) return `${m[1].padStart(2, "0")}:${m[2]}`;
  return String(value);
}

export function parseDateTimeValue(value) {
  if (value == null || value === "") return null;
  const raw = String(value).trim();
  if (raw.length === 16 && raw.includes("T")) {
    const d = dayjs(raw, API_DATETIME_FORMAT, true);
    if (d.isValid()) return d;
  }
  for (const fmt of DATETIME_PARSE_FORMATS) {
    const d = dayjs(raw, fmt, true);
    if (d.isValid()) return d;
  }
  const loose = dayjs(raw);
  return loose.isValid() ? loose : null;
}

export function formatDateTimeValue(value) {
  if (!value?.isValid?.()) return "";
  return value.format(API_DATETIME_FORMAT);
}

/** Normalize API/datetime-local strings for form state (YYYY-MM-DDTHH:mm). */
export function normalizeDateTimeInput(value) {
  if (value == null || value === "") return "";
  const d = parseDateTimeValue(value);
  return d ? formatDateTimeValue(d) : String(value).slice(0, 16);
}

const DATE_ONLY_FIELD_RE =
  /_date$|^date_|^pickup_date$|^delivery_date$|^collection_date$|^period_from$|^period_to$/;
const DATETIME_FIELD_RE = /_at$/;

export function isDateOnlyFieldKey(key) {
  return Boolean(key && DATE_ONLY_FIELD_RE.test(key));
}

export function isDateTimeFieldKey(key) {
  return Boolean(key && DATETIME_FIELD_RE.test(key));
}

export function formatDisplayDate(value) {
  if (value == null || value === "") return "—";
  const parsed = parseDateValue(value);
  if (parsed?.isValid?.()) return parsed.format(DISPLAY_DATE_FORMAT);
  const dt = parseDateTimeValue(value);
  if (dt?.isValid?.()) return dt.format(DISPLAY_DATE_FORMAT);
  const loose = dayjs(value);
  if (loose.isValid()) return loose.format(DISPLAY_DATE_FORMAT);
  return String(value);
}

export function formatDisplayDateTime(value) {
  if (value == null || value === "") return "—";
  const dt = parseDateTimeValue(value);
  if (dt?.isValid?.()) return dt.format(DISPLAY_DATETIME_FORMAT);
  const dateOnly = parseDateValue(value);
  if (dateOnly?.isValid?.()) return dateOnly.format(DISPLAY_DATETIME_FORMAT);
  const loose = dayjs(value);
  if (loose.isValid()) return loose.format(DISPLAY_DATETIME_FORMAT);
  return String(value);
}
