import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import SmoothDatePicker from "@/components/common/SmoothDatePicker";
import { ProSearchField } from "@/components/common/form";
import TableExportActions from "@/components/common/TableExportActions";
import TableRefreshButton from "@/components/common/TableRefreshButton";
import TableActiveFilterChips from "@/components/common/TableActiveFilterChips";
import TableAutoRefresh from "@/components/common/TableAutoRefresh";
import { useTranslation } from "@/context/LanguageContext";
import {
  TABLE_FILTER_HEIGHT,
  TABLE_FILTER_SEARCH_MIN,
  TABLE_FILTER_SEARCH_WIDTH,
} from "@/constants/layout";
import { tablePanelToolbarSx } from "@/constants/tablePanel";

const filterItemSx = {
  flexShrink: 0,
  "& .MuiFormControl-root": {
    margin: 0,
  },
};

function resolveToggleLabel(item, t) {
  if (item.labelKey) {
    return t(item.labelKey, { defaultValue: item.label ?? item.field });
  }
  if (item.label) return item.label;
  return t(`fields.${item.field}`, { defaultValue: item.field });
}

/** GJM-style filter card: search + export icons, then date toggles + range row */
export default function TableFilters({
  filters,
  onFilterChange,
  onReset,
  searchPlaceholder,
  showSearch = true,
  dateFields = [],
  extra,
  hasActiveFilters,
  exportEndpoint,
  exportListParams,
  exportColumns = [],
  exportFilenameBase,
  exportTitle,
  exportDisabled,
  includeModelFields = false,
  onRefresh,
  refreshing = false,
  refreshDisabled,
  columnToggle = null,
  densityToggle = null,
  activeFilterChips = null,
  onFilterChipRemove,
  filterChipExtra = [],
  autoRefreshInterval = 0,
  onAutoRefreshIntervalChange,
}) {
  const { t } = useTranslation();
  const resolvedSearchPlaceholder = searchPlaceholder ?? t("filters.search");
  const set = (key) => (e) => onFilterChange(key, e.target.value);

  const showExport = Boolean(exportEndpoint);
  const canClear = Boolean(onReset);
  const filtersActive = Boolean(hasActiveFilters);
  const showDateSection = dateFields.length > 0;

  const ensureDateField = (field) => {
    if (!field && dateFields[0]?.field) {
      onFilterChange("date_field", dateFields[0].field);
      return dateFields[0].field;
    }
    return field;
  };

  const setDateFrom = (value) => {
    if (value) ensureDateField(filters.date_field);
    onFilterChange("date_from", value);
  };

  const setDateTo = (value) => {
    if (value) ensureDateField(filters.date_field);
    onFilterChange("date_to", value);
  };

  const setExactDate = (value) => {
    if (value) ensureDateField(filters.date_field);
    onFilterChange("date", value);
  };

  const handleDateFieldToggle = (field) => {
    onFilterChange("date_field", filters.date_field === field ? "" : field);
  };

  return (
    <Box sx={tablePanelToolbarSx}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            alignItems: { xl: "flex-end" },
            gap: 1.5,
            rowGap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              flexWrap: { lg: "wrap" },
              alignItems: { lg: "flex-end" },
              gap: 1.5,
              rowGap: 1.5,
              flex: "1 1 auto",
              minWidth: 0,
              width: "100%",
            }}
          >
            {showSearch && (
              <Box
                sx={{
                  ...filterItemSx,
                  width: { xs: "100%", lg: TABLE_FILTER_SEARCH_WIDTH },
                  minWidth: { lg: TABLE_FILTER_SEARCH_MIN.sm },
                  maxWidth: { xs: "100%", lg: TABLE_FILTER_SEARCH_WIDTH },
                  flexShrink: 0,
                }}
              >
                <ProSearchField
                  filterBar
                  type="search"
                  placeholder={resolvedSearchPlaceholder}
                  value={filters.search ?? ""}
                  onChange={set("search")}
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </Box>
            )}

            {extra}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
              width: { xs: "100%", xl: "auto" },
              flexShrink: 0,
              justifyContent: { xs: "flex-start", xl: "flex-end" },
            }}
          >
            {canClear ? (
              <Tooltip title={t("filters.clearFilters")}>
                <span>
                  <IconButton
                    size="small"
                    disabled={!filtersActive}
                    onClick={onReset}
                    aria-label={t("filters.clearFilters")}
                    sx={{
                      width: TABLE_FILTER_HEIGHT,
                      height: TABLE_FILTER_HEIGHT,
                      flexShrink: 0,
                      border: 1,
                      borderColor: filtersActive ? "error.light" : "divider",
                      color: filtersActive ? "error.main" : "text.disabled",
                      opacity: filtersActive ? 1 : 0.42,
                      transition:
                        "opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                    }}
                  >
                    <FilterAltOffIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}

            <TableRefreshButton
              onRefresh={onRefresh}
              refreshing={refreshing}
              disabled={refreshDisabled}
            />

            {onAutoRefreshIntervalChange ? (
              <TableAutoRefresh
                onRefresh={onRefresh}
                disabled={refreshDisabled}
                intervalSec={autoRefreshInterval}
                onIntervalChange={onAutoRefreshIntervalChange}
              />
            ) : null}

            {columnToggle || densityToggle ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                {columnToggle}
                {densityToggle}
              </Box>
            ) : null}

            {showExport && (
              <TableExportActions
                compact
                endpoint={exportEndpoint}
                listParams={exportListParams}
                columns={exportColumns}
                filenameBase={exportFilenameBase ?? exportEndpoint}
                title={exportTitle}
                disabled={exportDisabled}
                includeModelFields={includeModelFields}
              />
            )}
          </Box>
        </Box>

        {showDateSection ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1.25,
              rowGap: 1.25,
              pt: 0.25,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, mr: 0.25, flexShrink: 0 }}
            >
              {t("filters.dateField", { defaultValue: "Date type" })}
            </Typography>

            {dateFields.map((item) => (
              <FormControlLabel
                key={item.field}
                sx={{
                  m: 0,
                  mr: 0.5,
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.8125rem",
                    whiteSpace: { xs: "normal", sm: "nowrap" },
                  },
                }}
                control={
                  <Switch
                    size="small"
                    checked={filters.date_field === item.field}
                    onChange={() => handleDateFieldToggle(item.field)}
                    inputProps={{
                      "aria-label": resolveToggleLabel(item, t),
                    }}
                  />
                }
                label={resolveToggleLabel(item, t)}
              />
            ))}

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.25,
                rowGap: 1.25,
                width: { xs: "100%", lg: "auto" },
                ml: { lg: "auto" },
              }}
            >
              <SmoothDatePicker
                filterBar
                label={t("filters.pickOneDay")}
                value={filters.date ?? ""}
                onChange={setExactDate}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, px: 0.25, flexShrink: 0 }}
              >
                {t("filters.or")}
              </Typography>
              <SmoothDatePicker
                filterBar
                label={t("filters.from")}
                value={filters.date_from ?? ""}
                onChange={setDateFrom}
                maxDate={filters.date_to || undefined}
              />
              <SmoothDatePicker
                filterBar
                label={t("filters.to")}
                value={filters.date_to ?? ""}
                onChange={setDateTo}
                minDate={filters.date_from || undefined}
              />
            </Box>
          </Box>
        ) : null}
      </Box>

      {activeFilterChips !== false && onFilterChipRemove ? (
        <TableActiveFilterChips
          filters={filters}
          dateFields={dateFields}
          onRemove={onFilterChipRemove}
          extraChips={filterChipExtra}
        />
      ) : null}
    </Box>
  );
}
