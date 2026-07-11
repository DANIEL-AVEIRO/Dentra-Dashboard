import BooleanField from "@/components/common/BooleanField";
import { toBoolean } from "@/utils/boolean";

/**
 * Active / Inactive toggle for forms — same Switch UI as BooleanField (e.g. Users admin).
 * `mode`: "boolean" for is_active fields, "string" for status = active|inactive.
 */
export default function ActiveStatusField({
  value,
  onChange,
  disabled = false,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  mode = "boolean",
  "aria-label": ariaLabel = "Status",
}) {
  const isActive =
    mode === "string"
      ? String(value ?? "").toLowerCase() === "active"
      : toBoolean(value);

  return (
    <BooleanField
      label={ariaLabel}
      value={isActive}
      onChange={(checked) =>
        onChange(mode === "string" ? (checked ? "active" : "inactive") : checked)
      }
      disabled={disabled}
      activeLabel={activeLabel}
      inactiveLabel={inactiveLabel}
      showLabel={false}
    />
  );
}
