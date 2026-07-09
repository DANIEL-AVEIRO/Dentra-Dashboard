import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  createFilterOptions,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import client from "@/api/client";
import { useTranslation } from "@/context/LanguageContext";
import {
  autocompletePaperSx,
  inputLabelSx,
  filterInputLabelSx,
  inputBaseSx,
  filterInputBaseSx,
  optionStateSx,
  outlinedInputRootSx,
  filterOutlinedInputRootSx,
  adornmentIconSx,
  inputAdornmentSx,
} from "@/components/common/form/fieldStyles";
import { TABLE_FILTER_SELECT_WIDTH } from "@/constants/layout";

const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: (option) => option?.label ?? "",
});

/**
 * Normalize API / config options to { value, label }.
 */
export function normalizeOptions(
  options = [],
  { valueKey = "id", labelKey = "name" } = {}
) {
  return options.map((opt) => ({
    value: opt[valueKey] ?? opt.value ?? opt.id ?? "",
    label:
      opt[labelKey] ??
      opt.label ??
      opt.name ??
      String(opt[valueKey] ?? opt.value ?? ""),
    ...opt,
  }));
}

function mergeOption(list, option) {
  if (!option?.value && option?.value !== 0) return list;
  const id = String(option.value);
  if (list.some((o) => String(o.value) === id)) return list;
  return [option, ...list];
}

export default function SearchableSelect({
  label,
  labelPlacement = "outlined",
  id,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  clearable = true,
  size = "small",
  fullWidth = true,
  helperText,
  error,
  noOptionsText,
  loading = false,
  loadingText,
  valueKey = "id",
  labelKey = "name",
  openOnFocus = true,
  searchable = true,
  filterBar = false,
  multiple = false,
  disableCloseOnSelect = true,
  limitTags = 2,
  optionsEndpoint,
  optionsParams,
  optionsListOnly = false,
  initialOptionLabel,
  initialOptionValue,
  sx,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const topLabel = labelPlacement === "top";
  const showOutlinedLabel = !topLabel && label;
  const resolvedPlaceholder =
    placeholder ??
    (topLabel && label
      ? t("placeholders.searchField", { field: label })
      : t("placeholders.searchField", { field: label?.toLowerCase() ?? "" }));
  const showHelperOnField = !topLabel && helperText;
  const rootSx = filterBar ? filterOutlinedInputRootSx : outlinedInputRootSx;
  const resolvedNoOptions = noOptionsText ?? t("common.noResults");
  const resolvedLoading = loadingText ?? t("common.loading");

  const [inputValue, setInputValue] = useState("");
  const [remoteOptions, setRemoteOptions] = useState([]);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const optionCacheRef = useRef(new Map());
  const bootstrapKeyRef = useRef(null);

  const bootstrapKey = `${initialOptionValue ?? ""}|${initialOptionLabel ?? ""}`;

  const staticNormalized = useMemo(() => {
    return normalizeOptions(options, { valueKey, labelKey });
  }, [options, valueKey, labelKey]);

  const effectiveNormalized = optionsEndpoint ? remoteOptions : staticNormalized;

  const selected = useMemo(() => {
    if (multiple) {
      const ids = new Set((Array.isArray(value) ? value : []).map((v) => String(v)));
      return effectiveNormalized.filter((o) => ids.has(String(o.value)));
    }

    if (value == null || value === "") return null;

    const id = String(value);
    const fromList = effectiveNormalized.find((o) => String(o.value) === id);
    if (fromList) return fromList;

    const cached = optionCacheRef.current.get(id);
    if (cached) return cached;

    const bootLabel = (initialOptionLabel || "").trim();
    if (
      bootLabel &&
      initialOptionValue != null &&
      initialOptionValue !== "" &&
      id === String(initialOptionValue)
    ) {
      return { value, label: bootLabel };
    }

    return null;
  }, [
    multiple,
    value,
    effectiveNormalized,
    initialOptionLabel,
    initialOptionValue,
  ]);

  const upsertRemoteOption = useCallback((option) => {
    if (!option) return;
    const id = String(option.value);
    optionCacheRef.current.set(id, option);
    setRemoteOptions((prev) => mergeOption(prev, option));
  }, []);

  useEffect(() => {
    optionCacheRef.current.clear();
    setRemoteOptions([]);
    setInputValue("");
    bootstrapKeyRef.current = null;
  }, [optionsEndpoint, valueKey, labelKey]);

  useEffect(() => {
    if (bootstrapKeyRef.current === bootstrapKey) return;
    bootstrapKeyRef.current = bootstrapKey;
    const bootLabel = (initialOptionLabel || "").trim();
    if (
      !optionsEndpoint ||
      multiple ||
      !bootLabel ||
      initialOptionValue == null ||
      initialOptionValue === ""
    ) {
      return;
    }
    const opt = { value: initialOptionValue, label: bootLabel };
    optionCacheRef.current.set(String(initialOptionValue), opt);
    setRemoteOptions((prev) => mergeOption(prev, opt));
  }, [bootstrapKey, optionsEndpoint, multiple, initialOptionLabel, initialOptionValue]);

  useEffect(() => {
    if (!optionsEndpoint || multiple) return undefined;

    const path = optionsEndpoint.replace(/\/$/, "");
    const apiPath = path.startsWith("/") ? path : `/${path}/`;
    const timer = setTimeout(async () => {
      setRemoteLoading(true);
      try {
        const { data } = await client.get(apiPath, {
          params: {
            ...optionsParams,
            search: inputValue.trim(),
            page_size: 50,
          },
          skipTopLoader: true,
        });
        const rows = Array.isArray(data) ? data : data.results ?? data;
        const normalized = normalizeOptions(rows, { valueKey, labelKey });
        setRemoteOptions((prev) => {
          let merged = normalized;
          if (value != null && value !== "") {
            const cached = optionCacheRef.current.get(String(value));
            if (cached) merged = mergeOption(merged, cached);
          }
          return merged;
        });
      } catch {
        if (value == null || value === "") {
          setRemoteOptions([]);
        }
      } finally {
        setRemoteLoading(false);
      }
    }, inputValue.trim() ? 280 : 0);

    return () => clearTimeout(timer);
  }, [optionsEndpoint, inputValue, valueKey, labelKey, JSON.stringify(optionsParams)]);

  /** Sync typed/display text only when the bound value changes — not on every options reload. */
  useEffect(() => {
    if (!optionsEndpoint || multiple) return;

    if (value == null || value === "") {
      setInputValue("");
      return;
    }

    const id = String(value);
    const cached = optionCacheRef.current.get(id);
    if (cached?.label) {
      setInputValue(cached.label);
      return;
    }

    const bootLabel = (initialOptionLabel || "").trim();
    if (
      bootLabel &&
      initialOptionValue != null &&
      initialOptionValue !== "" &&
      id === String(initialOptionValue)
    ) {
      setInputValue(bootLabel);
    }
  }, [value, optionsEndpoint, multiple, initialOptionLabel, initialOptionValue]);

  useEffect(() => {
    if (
      !optionsEndpoint ||
      optionsListOnly ||
      multiple ||
      value == null ||
      value === ""
    ) {
      return;
    }
    const id = String(value);
    if (
      effectiveNormalized.some((o) => String(o.value) === id) ||
      optionCacheRef.current.has(id)
    ) {
      return;
    }
    const base = optionsEndpoint.replace(/\/$/, "");
    const detailPath = base.startsWith("/") ? `${base}/${value}/` : `/${base}/${value}/`;
    client
      .get(detailPath, { skipTopLoader: true })
      .then(({ data }) => {
        const opt = normalizeOptions([data], { valueKey, labelKey })[0];
        if (opt) upsertRemoteOption(opt);
      })
      .catch(() => {});
  }, [
    optionsEndpoint,
    optionsListOnly,
    value,
    multiple,
    valueKey,
    labelKey,
    effectiveNormalized,
    upsertRemoteOption,
  ]);

  const handleChange = (_, next) => {
    if (multiple) {
      onChange((next ?? []).map((o) => o.value));
      return;
    }

    if (next == null) {
      if (value != null && value !== "") {
        optionCacheRef.current.delete(String(value));
      }
      onChange("");
      setInputValue("");
      return;
    }

    const opt = {
      value: next.value,
      label: next.label ?? String(next.value),
    };
    optionCacheRef.current.set(String(opt.value), opt);
    if (optionsEndpoint) {
      setRemoteOptions((prev) => mergeOption(prev, opt));
      setInputValue(opt.label);
    }
    onChange(opt.value ?? "");
  };

  return (
    <Autocomplete
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      loadingText={resolvedLoading}
      openOnFocus={openOnFocus}
      autoHighlight
      selectOnFocus
      clearOnBlur={false}
      handleHomeEndKeys
      multiple={multiple}
      disableCloseOnSelect={multiple && disableCloseOnSelect}
      limitTags={multiple ? limitTags : undefined}
      options={effectiveNormalized}
      value={selected}
      disableClearable={!clearable}
      filterOptions={optionsEndpoint ? (opts) => opts : filterOptions}
      loading={loading || remoteLoading}
      onInputChange={(_, next, reason) => {
        if (!optionsEndpoint || multiple) return;

        if (reason === "input") {
          setInputValue(next);
          if (next.trim() === "") {
            onChange("");
          }
          return;
        }

        if (reason === "clear") {
          setInputValue("");
          onChange("");
          return;
        }

        if (reason === "reset") {
          if (value == null || value === "") {
            setInputValue("");
            return;
          }
          const id = String(value);
          const cached = optionCacheRef.current.get(id);
          if (cached?.label) {
            setInputValue(cached.label);
          } else if (
            initialOptionLabel &&
            initialOptionValue != null &&
            id === String(initialOptionValue)
          ) {
            setInputValue(initialOptionLabel);
          }
        }
      }}
      inputValue={optionsEndpoint ? inputValue : undefined}
      getOptionLabel={(opt) => opt?.label ?? ""}
      isOptionEqualToValue={(opt, val) =>
        String(opt?.value) === String(val?.value)
      }
      onChange={handleChange}
      noOptionsText={resolvedNoOptions}
      popupIcon={
        <KeyboardArrowDownIcon
          sx={{ color: theme.palette.primary.main, fontSize: 22, opacity: 0.9 }}
        />
      }
      slotProps={{
        paper: {
          elevation: 0,
          sx: autocompletePaperSx(theme),
        },
        clearIndicator: {
          sx: {
            color: "text.secondary",
            "&:hover": { color: theme.palette.primary.main },
          },
        },
      }}
      renderOption={(props, option, { selected: isSelected }) => {
        const { key, ...rest } = props;
        return (
          <Box
            component="li"
            key={key}
            {...rest}
            sx={optionStateSx(theme, isSelected)}
          >
            {option.label}
          </Box>
        );
      }}
      sx={{
        "& .MuiAutocomplete-popupIndicator": {
          transition: "transform 0.2s ease",
        },
        "& .Mui-focused .MuiAutocomplete-popupIndicator": {
          transform: "rotate(180deg)",
        },
        ...(multiple && {
          "& .MuiOutlinedInput-root": {
            alignItems: "flex-start",
            py: 0.75,
          },
        }),
        ...(filterBar && {
          "& .MuiOutlinedInput-root": {
            flexWrap: "nowrap",
          },
        }),
        ...sx,
      }}
      renderInput={(params) => {
        const { InputProps: inputPropsFromParams, inputProps, ...restParams } =
          params;
        const existingStart = inputPropsFromParams?.startAdornment;
        const searchAdornment = searchable ? (
          <InputAdornment position="start" sx={inputAdornmentSx(theme, "start")}>
            <SearchIcon />
          </InputAdornment>
        ) : null;

        return (
          <TextField
            {...restParams}
            id={id}
            label={showOutlinedLabel ? label : undefined}
            placeholder={resolvedPlaceholder}
            helperText={showHelperOnField ? helperText : undefined}
            error={error}
            InputLabelProps={
              showOutlinedLabel
                ? {
                    ...params.InputLabelProps,
                    shrink: true,
                    required: Boolean(required),
                    sx: {
                      ...(filterBar ? filterInputLabelSx(theme) : inputLabelSx(theme)),
                      ...params.InputLabelProps?.sx,
                    },
                  }
                : { ...params.InputLabelProps, sx: { display: "none" } }
            }
            InputProps={{
              ...inputPropsFromParams,
              sx: {
                ...rootSx(theme),
                ...inputPropsFromParams?.sx,
              },
              startAdornment: searchAdornment ? (
                <>
                  {searchAdornment}
                  {existingStart}
                </>
              ) : (
                existingStart
              ),
            }}
            inputProps={{
              ...inputProps,
              onFocus: (e) => {
                inputProps?.onFocus?.(e);
                if (searchable && !multiple) {
                  e.target.select();
                }
              },
              style: {
                ...(filterBar ? filterInputBaseSx() : inputBaseSx()),
                ...inputProps?.style,
              },
            }}
          />
        );
      }}
    />
  );
}

/** Filter toolbar — type-to-search dropdown */
export function FilterSelect({
  label,
  value,
  onChange,
  options,
  includeAll = true,
  allLabel,
  filterBar = true,
  sx,
  ...rest
}) {
  const { t } = useTranslation();
  const resolvedAll = allLabel ?? t("common.all");
  const opts = includeAll
    ? [{ value: "", label: resolvedAll }, ...normalizeOptions(options)]
    : normalizeOptions(options);

  return (
    <SearchableSelect
      label={label}
      value={value}
      onChange={onChange}
      options={opts}
      clearable={false}
      openOnFocus
      searchable
      filterBar={filterBar}
      placeholder={t("placeholders.searchField", {
        field: label?.toLowerCase() ?? "",
      })}
      sx={{
        minWidth: { xs: "100%", sm: TABLE_FILTER_SELECT_WIDTH },
        maxWidth: { xs: "100%", sm: TABLE_FILTER_SELECT_WIDTH.sm },
        flexShrink: 0,
        ...sx,
      }}
      {...rest}
    />
  );
}
