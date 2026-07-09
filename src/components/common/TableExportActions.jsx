import { useCallback, useMemo, useState } from "react";
import {
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useTranslation } from "@/context/LanguageContext";
import { fetchAllFilteredRows } from "@/utils/fetchAllFilteredRows";
import client from "@/api/client";
import {
  buildExportFilename,
  exportTableExcel,
  exportTablePdf,
} from "@/utils/exportTable";
import { buildExportColumnOptions } from "@/utils/exportColumns";
import { toast, getErrorMessage } from "@/utils/toast";
import { TABLE_FILTER_HEIGHT } from "@/constants/layout";
import ExportColumnPickerDialog from "@/components/common/ExportColumnPickerDialog";

/**
 * GJM-style export — pick columns first, then Excel / PDF (filtered rows, all pages).
 */
export default function TableExportActions({
  endpoint,
  listParams = {},
  columns = [],
  filenameBase = "export",
  title,
  disabled = false,
  compact = false,
  includeModelFields = false,
  /** When set, export these rows instead of fetching from the API */
  rows: staticRows = null,
  sx,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const [busy, setBusy] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerFormat, setPickerFormat] = useState("excel");
  const [apiFields, setApiFields] = useState(null);

  const base = endpoint?.replace(/^\//, "") ?? "";
  const canExport = Boolean(staticRows?.length) || Boolean(endpoint);

  const pickerColumns = useMemo(
    () => buildExportColumnOptions(columns, includeModelFields ? apiFields : []),
    [columns, apiFields, includeModelFields]
  );

  const loadApiFields = useCallback(async () => {
    if (!includeModelFields || !base) return;
    try {
      const { data } = await client.get(`/${base}/export-fields/`, {
        params: listParams,
        skipTopLoader: true,
      });
      setApiFields(data?.fields ?? []);
    } catch {
      setApiFields([]);
    }
  }, [base, listParams, includeModelFields]);

  const openPicker = (format) => {
    setPickerFormat(format);
    setPickerOpen(true);
    if (includeModelFields && apiFields === null) {
      loadApiFields();
    }
  };

  const runExport = async (format, pickedColumns) => {
    if (!pickedColumns?.length) return;
    if (staticRows == null && !base) return;
    setBusy(true);
    try {
      const rows =
        staticRows != null
          ? staticRows
          : await fetchAllFilteredRows(endpoint, listParams);
      if (!rows.length) {
        toast.warning(t("export.noData"));
        return;
      }

      const name = buildExportFilename(
        filenameBase ?? base ?? "export",
        format === "excel" ? "xlsx" : "pdf"
      );

      if (format === "excel") {
        exportTableExcel(pickedColumns, rows, name);
      } else {
        exportTablePdf(pickedColumns, rows, name, { title });
      }
      toast.success(t("export.success"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("export.failed")));
    } finally {
      setBusy(false);
    }
  };

  const handlePickerConfirm = (picked) => {
    setPickerOpen(false);
    runExport(pickerFormat, picked);
  };

  const dialog = (
    <ExportColumnPickerDialog
      open={pickerOpen}
      format={pickerFormat}
      columns={pickerColumns}
      endpoint={endpoint}
      filenameBase={filenameBase}
      onClose={() => setPickerOpen(false)}
      onConfirm={handlePickerConfirm}
    />
  );

  if (compact) {
    const iconBtnSx = {
      width: TABLE_FILTER_HEIGHT,
      height: TABLE_FILTER_HEIGHT,
      border: 1,
      borderColor: "divider",
      color: primary,
    };

    return (
      <>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="nowrap"
          sx={{ flexShrink: 0, ...sx }}
        >
          <Tooltip title={t("export.excelHint")}>
            <span>
              <IconButton
                size="small"
                disabled={disabled || busy || !canExport}
                onClick={() => openPicker("excel")}
                aria-label={t("export.excel")}
                sx={iconBtnSx}
              >
                {busy ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <TableViewIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t("export.pdfHint")}>
            <span>
              <IconButton
                size="small"
                disabled={disabled || busy || !canExport}
                onClick={() => openPicker("pdf")}
                aria-label={t("export.pdf")}
                sx={iconBtnSx}
              >
                {busy ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <PictureAsPdfIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        {dialog}
      </>
    );
  }

  return null;
}
