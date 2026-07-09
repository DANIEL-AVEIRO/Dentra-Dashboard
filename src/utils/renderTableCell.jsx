import { Link as RouterLink } from "react-router-dom";
import { Box, Switch } from "@mui/material";
import HighlightText from "@/components/common/HighlightText";
import BooleanCell from "@/components/common/BooleanCell";
import StatusChip from "@/components/common/StatusChip";
import TableBooleanSwitch from "@/components/common/TableBooleanSwitch";
import CopyableText from "@/components/common/CopyableText";
import { tableCellInnerSx } from "@/constants/tableStyles";
import { formatCellValue, isUuid } from "@/utils/displayValue";
import { isBooleanColumnKey } from "@/utils/fieldTypes";
import { resolveStatusColumnConfig } from "@/utils/statusColumnRegistry";

export function getCellPlainText(value, row, key) {
  if (row != null && key != null) {
    return formatCellValue(row, key);
  }
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") {
    if (value.label != null) return String(value.label);
    if (value.name != null) return String(value.name);
  }
  if (isUuid(String(value))) return "—";
  return String(value);
}

export function getColumnSearchText(col, row) {
  if (col.getSearchText) return col.getSearchText(row);
  if (col.exportValue) {
    const v = col.exportValue(row);
    return v == null ? "" : String(v);
  }
  const statusConfig = resolveStatusColumnConfig(col);
  if (statusConfig && !col.render) {
    const value = row[col.key];
    if (value != null && value !== "") {
      const meta = statusConfig.list.find((s) => s.value === value);
      return meta?.label ?? String(value);
    }
  }
  return getCellPlainText(row[col.key], row, col.key);
}

export function renderTableCell(col, row, highlightQuery, options = {}) {
  const query = highlightQuery?.trim();
  const { onInlinePatch, inlinePatchKeys = [], copyableKeys = [] } = options;

  if (col.render) {
    const content = col.render(row);
    if (query && (typeof content === "string" || typeof content === "number")) {
      return <HighlightText text={String(content)} query={query} />;
    }
    return content;
  }

  if (col.relatedLink) {
    const to =
      typeof col.relatedLink === "function" ? col.relatedLink(row) : col.relatedLink;
    const label = getCellPlainText(row[col.key], row, col.key);
    if (!to || label === "—") return label;
    return (
      <Box
        component={RouterLink}
        to={to}
        onClick={(e) => e.stopPropagation()}
        sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none" }}
      >
        {query ? <HighlightText text={label} query={query} /> : label}
      </Box>
    );
  }

  const statusConfig = resolveStatusColumnConfig(col);
  const statusValue = row[col.key];
  if (statusConfig && statusValue != null && statusValue !== "") {
    return (
      <StatusChip
        value={statusValue}
        statusList={statusConfig.list}
        translationNs={statusConfig.translationNs}
        size={statusConfig.size ?? "sm"}
      />
    );
  }

  if (
    onInlinePatch &&
    inlinePatchKeys.includes(col.key) &&
    (col.type === "boolean" || isBooleanColumnKey(col.key))
  ) {
    return (
      <Switch
        size="small"
        checked={Boolean(row[col.key])}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onInlinePatch(row, col.key, e.target.checked)}
      />
    );
  }

  if (col.type === "boolean" || isBooleanColumnKey(col.key)) {
    if (col.booleanDisplay === "switch") {
      return (
        <TableBooleanSwitch
          value={row[col.key]}
          trueLabel={col.trueLabel ?? col.activeLabel}
          falseLabel={col.falseLabel ?? col.inactiveLabel}
        />
      );
    }
    return (
      <BooleanCell
        value={row[col.key]}
        trueLabel={col.trueLabel ?? col.activeLabel}
        falseLabel={col.falseLabel ?? col.inactiveLabel}
      />
    );
  }

  const text = getCellPlainText(row[col.key], row, col.key);
  const content =
    !query || text === "—" ? text : <HighlightText text={text} query={query} />;

  if (col.copyable || copyableKeys.includes(col.key)) {
    return <CopyableText text={text}>{content}</CopyableText>;
  }

  return (
    <Box component="span" sx={tableCellInnerSx} title={text !== "—" ? text : undefined}>
      {content}
    </Box>
  );
}
