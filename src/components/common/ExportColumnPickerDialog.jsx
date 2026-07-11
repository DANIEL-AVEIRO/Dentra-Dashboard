import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Typography,
  alpha,
} from "@mui/material";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import DeselectOutlinedIcon from "@mui/icons-material/DeselectOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import { useTranslation } from "@/context/LanguageContext";
import ActionButton from "@/components/common/ActionButton";
import ToolbarActionButton from "@/components/common/ToolbarActionButton";
import ResponsiveDialog from "@/components/common/ResponsiveDialog";
import { formDialogActionsSx } from "@/components/common/statusDialogLayout";
import { BRAND_PRIMARY } from "@/constants/brand";
import { getExportableColumns } from "@/utils/exportTable";

function storageKey(endpoint, filenameBase) {
  return `export-columns:${endpoint || filenameBase || "default"}`;
}

function loadStoredKeys(endpoint, filenameBase, allKeys) {
  try {
    const raw = sessionStorage.getItem(storageKey(endpoint, filenameBase));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const allowed = new Set(allKeys);
    const kept = parsed.filter((k) => allowed.has(k));
    return kept.length ? kept : null;
  } catch {
    return null;
  }
}

function saveStoredKeys(endpoint, filenameBase, keys) {
  try {
    sessionStorage.setItem(
      storageKey(endpoint, filenameBase),
      JSON.stringify(keys)
    );
  } catch {
    /* ignore quota */
  }
}

const FORMAT_LABEL_KEYS = {
  excel: "export.chooseColumnsExcel",
  pdf: "export.chooseColumnsPdf",
  csv: "export.chooseColumnsCsv",
};

function ColumnQuickActions({ allSelected, noneSelected, onSelectAll, onClearAll, t }) {
  const segmentSx = {
    flex: 1,
    minHeight: 38,
    px: 1.5,
    py: 0.75,
    borderRadius: 0,
    fontWeight: 700,
    fontSize: "0.8125rem",
    textTransform: "none",
    gap: 0.75,
    border: "none",
    boxShadow: "none",
    "&:not(:last-of-type)": {
      borderRight: 1,
      borderColor: "divider",
    },
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        width: { xs: "100%", sm: "auto" },
        minWidth: { sm: 240 },
        borderRadius: 999,
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Button
        size="small"
        startIcon={<DoneAllOutlinedIcon sx={{ fontSize: 18 }} />}
        onClick={onSelectAll}
        disabled={allSelected}
        sx={{
          ...segmentSx,
          color: allSelected ? "text.disabled" : BRAND_PRIMARY,
          bgcolor: allSelected ? "action.hover" : alpha(BRAND_PRIMARY, 0.08),
          "&:hover": {
            bgcolor: allSelected ? "action.hover" : alpha(BRAND_PRIMARY, 0.14),
          },
          "&.Mui-disabled": {
            color: "text.disabled",
            bgcolor: "action.hover",
          },
        }}
      >
        {t("export.selectAllColumns")}
      </Button>
      <Button
        size="small"
        startIcon={<DeselectOutlinedIcon sx={{ fontSize: 18 }} />}
        onClick={onClearAll}
        disabled={noneSelected}
        sx={{
          ...segmentSx,
          color: noneSelected ? "text.disabled" : "error.main",
          bgcolor: noneSelected ? "action.hover" : (theme) =>
            alpha(theme.palette.error.main, theme.palette.mode === "light" ? 0.06 : 0.12),
          "&:hover": {
            bgcolor: noneSelected
              ? "action.hover"
              : (theme) => alpha(theme.palette.error.main, theme.palette.mode === "light" ? 0.1 : 0.18),
          },
          "&.Mui-disabled": {
            color: "text.disabled",
            bgcolor: "action.hover",
          },
        }}
      >
        {t("export.selectNoColumns")}
      </Button>
    </Box>
  );
}

export default function ExportColumnPickerDialog({
  open,
  format,
  columns,
  endpoint,
  filenameBase,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation();
  const exportable = useMemo(() => getExportableColumns(columns), [columns]);
  const allKeys = useMemo(() => exportable.map((c) => c.key), [exportable]);
  const [selected, setSelected] = useState(() => new Set(allKeys));

  useEffect(() => {
    if (!open) return;
    const stored = loadStoredKeys(endpoint, filenameBase, allKeys);
    setSelected(new Set(stored ?? allKeys));
  }, [open, endpoint, filenameBase, allKeys]);

  const toggle = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(allKeys));
  const selectNone = () => setSelected(new Set());

  const handleConfirm = () => {
    const keys = [...selected];
    if (!keys.length) return;
    saveStoredKeys(endpoint, filenameBase, keys);
    const picked = exportable.filter((c) => selected.has(c.key));
    onConfirm(picked);
  };

  const titleKey = FORMAT_LABEL_KEYS[format] || "export.chooseColumns";
  const totalCount = allKeys.length;
  const selectedCount = selected.size;
  const allSelected = totalCount > 0 && selectedCount === totalCount;
  const noneSelected = selectedCount === 0;

  return (
    <ResponsiveDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
        <ViewColumnOutlinedIcon sx={{ color: BRAND_PRIMARY, fontSize: 22 }} />
        {t(titleKey)}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
          {t("export.chooseColumnsHint")}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
          {t("export.filteredRowsHint")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 1.25,
            mb: 1.5,
            p: 1.25,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? alpha(BRAND_PRIMARY, 0.03)
                : alpha(BRAND_PRIMARY, 0.08),
          }}
        >
          <ColumnQuickActions
            allSelected={allSelected}
            noneSelected={noneSelected}
            onSelectAll={selectAll}
            onClearAll={selectNone}
            t={t}
          />
          <Chip
            size="small"
            icon={<ViewColumnOutlinedIcon sx={{ fontSize: "16px !important" }} />}
            label={t("export.columnsSelected", {
              defaultValue: "{{selected}} / {{total}} columns",
              selected: selectedCount,
              total: totalCount,
            })}
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              fontWeight: 700,
              bgcolor: allSelected
                ? alpha(BRAND_PRIMARY, 0.12)
                : "background.paper",
              color: allSelected ? BRAND_PRIMARY : "text.secondary",
              border: 1,
              borderColor: allSelected ? alpha(BRAND_PRIMARY, 0.28) : "divider",
              "& .MuiChip-icon": {
                color: allSelected ? BRAND_PRIMARY : "text.secondary",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            maxHeight: 320,
            overflowY: "auto",
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            px: 0.5,
            py: 0.5,
          }}
        >
          <FormGroup sx={{ gap: 0.25 }}>
            {exportable.map((col) => (
              <FormControlLabel
                key={col.key}
                sx={{
                  mx: 0,
                  px: 1,
                  py: 0.35,
                  borderRadius: 1.25,
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    fontWeight: selected.has(col.key) ? 600 : 400,
                  },
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={selected.has(col.key)}
                    onChange={() => toggle(col.key)}
                  />
                }
                label={col.label ?? col.key}
              />
            ))}
          </FormGroup>
        </Box>

        {noneSelected ? (
          <Typography variant="caption" color="error" sx={{ mt: 1.25, display: "block" }}>
            {t("export.pickAtLeastOne")}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={formDialogActionsSx}>
        <ToolbarActionButton variant="cancel" onClick={onClose}>
          {t("common.cancel")}
        </ToolbarActionButton>
        <ActionButton
          intent="export"
          onClick={handleConfirm}
          disabled={noneSelected}
          sx={{ px: 2.5 }}
        >
          {t("export.exportSelected", { count: selectedCount })}
        </ActionButton>
      </DialogActions>
    </ResponsiveDialog>
  );
}
