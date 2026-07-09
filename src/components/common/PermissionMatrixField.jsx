import { useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormHelperText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { ProTextField } from "@/components/common/form";
import { useTranslation } from "@/context/LanguageContext";
import { tableHeadBorder, tableHeaderBg } from "@/constants/tableStyles";
import { BRAND_PRIMARY } from "@/theme";
import {
  buildPermissionMatrix,
  filterPermissionMatrix,
  matrixAllPermissionsChecked,
  matrixRowAllChecked,
  matrixRowSomeChecked,
  matrixSomePermissionsChecked,
  normalizeSelectedIds,
  toPayloadIds,
  toggleMatrixAllPermissions,
  toggleMatrixCell,
  toggleMatrixRow,
} from "@/utils/permissionMatrix";

const ACTION_COL_WIDTH = 64;
const ALL_COL_WIDTH = 56;

function MatrixCheckbox({ checked, indeterminate, disabled, onChange, inputProps }) {
  return (
    <Checkbox
      size="small"
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.checked)}
      inputProps={inputProps}
    />
  );
}

function matrixHeaderCellSx(theme, headerBg = tableHeaderBg(theme)) {
  return {
    fontWeight: 700,
    fontSize: "0.6875rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: BRAND_PRIMARY,
    py: 1.25,
    px: 1,
    bgcolor: headerBg,
    backgroundImage: "none",
    borderBottom: tableHeadBorder(theme),
    whiteSpace: "nowrap",
    zIndex: 2,
  };
}

function MatrixRow({ row, selected, onToggleRow, onToggleCell, label, cells, subRow = false }) {
  const allChecked = matrixRowAllChecked(row, selected);
  const someChecked = matrixRowSomeChecked(row, selected);
  const displayLabel = label || row.moduleLabel;

  return (
    <TableRow
      hover
      sx={{
        "&:nth-of-type(even)": {
          bgcolor: (theme) =>
            subRow
              ? "transparent"
              : alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.02 : 0.04),
        },
        "&:last-child td": { borderBottom: 0 },
      }}
    >
      <TableCell
        sx={{
          fontWeight: subRow ? 500 : 600,
          pl: subRow ? 3.5 : 2,
          py: 1.125,
          minWidth: 200,
          borderBottom: `1px solid ${alpha(BRAND_PRIMARY, 0.08)}`,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "inherit",
            fontSize: subRow ? "0.8125rem" : "0.875rem",
            color: subRow ? "text.secondary" : "text.primary",
          }}
        >
          {subRow ? `↳ ${displayLabel}` : displayLabel}
        </Typography>
      </TableCell>
      <TableCell
        align="center"
        sx={{
          width: ALL_COL_WIDTH,
          py: 0.25,
          borderBottom: `1px solid ${alpha(BRAND_PRIMARY, 0.08)}`,
        }}
      >
        <MatrixCheckbox
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={(checked) => onToggleRow(row, checked)}
        />
      </TableCell>
      {cells.map((cell) => (
        <TableCell
          key={cell.key}
          align="center"
          sx={{
            width: ACTION_COL_WIDTH,
            py: 0.25,
            borderBottom: `1px solid ${alpha(BRAND_PRIMARY, 0.08)}`,
          }}
        >
          {cell.id ? (
            <MatrixCheckbox
              checked={selected.has(String(cell.id))}
              onChange={(checked) => onToggleCell(cell.id, checked)}
            />
          ) : (
            <Box sx={{ width: 28, height: 28, mx: "auto" }} />
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

/**
 * Module × action permission matrix (MODULE / ALL / VIEW / ADD / EDIT / DELETE).
 */
export default function PermissionMatrixField({
  label,
  value = [],
  onChange,
  options = [],
  searchPlaceholder,
  error = false,
  helperText,
  required = false,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const headerBg = tableHeaderBg(theme);
  const headerCellSx = matrixHeaderCellSx(theme, headerBg);
  const [query, setQuery] = useState("");
  const selected = useMemo(() => normalizeSelectedIds(value), [value]);

  const rows = useMemo(() => buildPermissionMatrix(options), [options]);
  const filteredRows = useMemo(
    () => filterPermissionMatrix(rows, query),
    [rows, query]
  );

  const setSelected = (next) => {
    onChange?.(toPayloadIds(next));
  };

  const handleToggleRow = (row, checked) => {
    setSelected(toggleMatrixRow(row, selected, checked));
  };

  const handleToggleCell = (id, checked) => {
    setSelected(toggleMatrixCell(id, selected, checked));
  };

  const handleToggleAllPermissions = (checked) => {
    setSelected(toggleMatrixAllPermissions(rows, selected, checked));
  };

  const allPermissionsChecked = matrixAllPermissionsChecked(rows, selected);
  const somePermissionsChecked = matrixSomePermissionsChecked(rows, selected);
  const selectedCount = selected.size;
  const columns = [
    { key: "view", label: t("pages.roles.matrix.view", { defaultValue: "VIEW" }) },
    { key: "add", label: t("pages.roles.matrix.add", { defaultValue: "ADD" }) },
    {
      key: "change",
      label: t("pages.roles.matrix.edit", { defaultValue: "EDIT" }),
    },
    {
      key: "delete",
      label: t("pages.roles.matrix.delete", { defaultValue: "DELETE" }),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} color="text.primary">
          {label}
          {required ? (
            <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
              *
            </Typography>
          ) : null}
        </Typography>
        <Chip
          size="small"
          label={t("pages.roles.selectedCount", {
            count: selectedCount,
            defaultValue: "{{count}} selected",
          })}
          sx={{
            height: 26,
            fontWeight: 600,
            fontSize: "0.75rem",
            bgcolor: (theme) => alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.08 : 0.18),
            color: BRAND_PRIMARY,
            border: `1px solid ${alpha(BRAND_PRIMARY, 0.2)}`,
          }}
        />
      </Box>

      <Stack spacing={0} sx={{ mt: 0.5, mb: 1.5 }}>
        {searchPlaceholder ? (
          <ProTextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        ) : null}

        {searchPlaceholder ? (
          <Divider
            sx={{
              my: 1.25,
              borderColor: (theme) =>
                alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.12 : 0.2),
            }}
          />
        ) : null}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.25,
            px: 1.25,
            py: 0.875,
            borderRadius: 1.5,
            border: 1,
            borderColor: alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.14 : 0.22),
            bgcolor: alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.04 : 0.1),
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={allPermissionsChecked}
                indeterminate={somePermissionsChecked && !allPermissionsChecked}
                onChange={(e) => handleToggleAllPermissions(e.target.checked)}
                sx={{
                  color: alpha(BRAND_PRIMARY, 0.55),
                  "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: BRAND_PRIMARY },
                }}
              />
            }
            label={
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {t("pages.roles.matrix.selectAll", { defaultValue: "Select all permissions" })}
              </Typography>
            }
            sx={{ m: 0, mr: 0.5 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: { xs: 0, sm: "auto" } }}>
            {t("pages.roles.matrix.selectAllHint", {
              defaultValue: "Applies to every module in the list below",
            })}
          </Typography>
        </Box>
      </Stack>

      <TableContainer
        sx={{
          flex: 1,
          minHeight: 280,
          maxHeight: { xs: 360, sm: 440 },
          border: 1,
          borderColor: error ? "error.main" : alpha(BRAND_PRIMARY, 0.16),
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? `0 1px 3px ${alpha(BRAND_PRIMARY, 0.06)}`
              : "none",
          overflow: "auto",
        }}
      >
        <Table size="small" stickyHeader sx={{ minWidth: 520 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellSx, pl: 2, minWidth: 200 }}>
                {t("pages.roles.matrix.module", { defaultValue: "MODULE" })}
              </TableCell>
              <TableCell align="center" sx={{ ...headerCellSx, width: ALL_COL_WIDTH }}>
                {t("pages.roles.matrix.all", { defaultValue: "ALL" })}
              </TableCell>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align="center"
                  sx={{ ...headerCellSx, width: ACTION_COL_WIDTH }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 4, borderBottom: 0 }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {t("pages.roles.matrix.empty", {
                      defaultValue: "No modules match your search.",
                    })}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.flatMap((row) => {
                const crudCells = columns.map((col) => ({
                  key: col.key,
                  id: row[col.key]?.id ?? null,
                }));
                const nodes = [
                  <MatrixRow
                    key={row.key}
                    row={row}
                    selected={selected}
                    onToggleRow={handleToggleRow}
                    onToggleCell={handleToggleCell}
                    cells={crudCells}
                  />,
                ];

                for (const custom of row.custom || []) {
                  const customId = String(custom.id);
                  nodes.push(
                    <TableRow
                      key={`${row.key}-${custom.id}`}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell
                        sx={{
                          pl: 3.5,
                          py: 0.875,
                          borderBottom: `1px solid ${alpha(BRAND_PRIMARY, 0.08)}`,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" fontSize="0.8125rem">
                          ↳ {custom.label}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: ALL_COL_WIDTH,
                          py: 0.25,
                          borderBottom: `1px solid ${alpha(BRAND_PRIMARY, 0.08)}`,
                        }}
                      >
                        <MatrixCheckbox
                          checked={selected.has(customId)}
                          onChange={(checked) => handleToggleCell(custom.id, checked)}
                        />
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          sx={{
                            width: ACTION_COL_WIDTH,
                            py: 0.25,
                            borderBottom: `1px solid ${alpha(BRAND_PRIMARY, 0.08)}`,
                          }}
                        />
                      ))}
                    </TableRow>
                  );
                }

                return nodes;
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {(error || helperText) && (
        <FormHelperText error={error} sx={{ mx: 0, mt: 1 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
