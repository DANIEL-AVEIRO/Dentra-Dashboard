import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Popover,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useTranslation } from "@/context/LanguageContext";
import { BRAND_PRIMARY } from "@/theme";
import {
  LOWER_TEETH,
  UPPER_TEETH,
  formatToothSelection,
  parseToothSelection,
  summarizeToothSelection,
} from "@/components/cases/toothChartData";

const TOOTH_PATH =
  "M0 0 C8 0 13 6 13 14 C13 20 11 24 8 26 L8 30 C8 34 5 37 0 37 C-5 37 -8 34 -8 30 L-8 26 C-11 24 -13 20 -13 14 C-13 6 -8 0 0 0 Z";

const TYPE_SCALE = {
  incisor: { sx: 0.72, sy: 1.08 },
  canine: { sx: 0.82, sy: 1.12 },
  premolar: { sx: 0.95, sy: 1.02 },
  molar: { sx: 1.15, sy: 0.98 },
};

function ToothShape({ tooth, selected, onToggle, isLower }) {
  const theme = useTheme();
  const scale = TYPE_SCALE[tooth.type] ?? TYPE_SCALE.premolar;
  const flip = isLower ? -1 : 1;
  const fill = selected
    ? alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.22 : 0.32)
    : alpha(
        theme.palette.background.paper,
        theme.palette.mode === "light" ? 1 : 0.9,
      );
  const stroke = selected
    ? theme.palette.primary.main
    : alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.35 : 0.5);

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onToggle(tooth.fdi)}
      aria-label={tooth.fdi}
      aria-pressed={selected}
      sx={{
        border: 0,
        p: 0,
        m: 0,
        bgcolor: "transparent",
        cursor: "pointer",
        width: 34,
        height: 54,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: isLower ? "flex-start" : "flex-end",
        gap: 0.25,
        borderRadius: 1,
        transition: "transform 0.12s ease",
        "&:hover": { transform: "scale(1.06)" },
        "&:focus-visible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      {!isLower ? (
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.65rem",
            fontWeight: selected ? 700 : 600,
            color: selected ? "primary.main" : "text.secondary",
            lineHeight: 1,
          }}
        >
          {tooth.fdi}
        </Typography>
      ) : null}
      <Box
        component="svg"
        viewBox="-16 -4 32 44"
        sx={{ width: 28, height: 38, display: "block", overflow: "visible" }}
      >
        <g transform={`scale(${scale.sx}, ${scale.sy * flip})`}>
          <path
            d={TOOTH_PATH}
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>
      </Box>
      {isLower ? (
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.65rem",
            fontWeight: selected ? 700 : 600,
            color: selected ? "primary.main" : "text.secondary",
            lineHeight: 1,
          }}
        >
          {tooth.fdi}
        </Typography>
      ) : null}
    </Box>
  );
}

function ToothArch({ teeth, selected, onToggle, isLower }) {
  const mid = teeth.length / 2;
  const right = teeth.slice(0, mid);
  const left = teeth.slice(mid);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: isLower ? "flex-start" : "flex-end",
        justifyContent: "center",
        gap: 0.25,
      }}
    >
      <Box sx={{ display: "flex", gap: 0.25 }}>
        {right.map((tooth) => (
          <ToothShape
            key={tooth.fdi}
            tooth={tooth}
            selected={selected.has(tooth.fdi)}
            onToggle={onToggle}
            isLower={isLower}
          />
        ))}
      </Box>
      <Box
        sx={{
          width: 10,
          alignSelf: "stretch",
          borderLeft: 1,
          borderColor: (t) =>
            alpha(BRAND_PRIMARY, t.palette.mode === "light" ? 0.15 : 0.25),
          mx: 0.5,
        }}
      />
      <Box sx={{ display: "flex", gap: 0.25 }}>
        {left.map((tooth) => (
          <ToothShape
            key={tooth.fdi}
            tooth={tooth}
            selected={selected.has(tooth.fdi)}
            onToggle={onToggle}
            isLower={isLower}
          />
        ))}
      </Box>
    </Box>
  );
}

export function ToothChart({ value, onChange, multiple = true }) {
  const { t } = useTranslation();
  const selected = useMemo(() => parseToothSelection(value), [value]);

  const toggle = (fdi) => {
    const next = new Set(selected);
    if (next.has(fdi)) {
      next.delete(fdi);
    } else if (multiple) {
      next.add(fdi);
    } else {
      next.clear();
      next.add(fdi);
    }
    onChange(formatToothSelection(next));
  };

  const clear = () => onChange("");

  return (
    <Box sx={{ p: 1.5, minWidth: 320 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          {t("toothChart.title")}
        </Typography>
        {selected.size > 0 ? (
          <Button size="small" onClick={clear}>
            {t("toothChart.clear")}
          </Button>
        ) : null}
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 1.5 }}
      >
        {t("toothChart.hint")}
      </Typography>
      <Box
        sx={{
          px: 0.5,
          py: 1,
          borderRadius: 2,
          bgcolor: (t) =>
            alpha(BRAND_PRIMARY, t.palette.mode === "light" ? 0.04 : 0.08),
        }}
      >
        <ToothArch teeth={UPPER_TEETH} selected={selected} onToggle={toggle} />
        <Box
          sx={{
            height: 8,
            borderTop: 1,
            borderBottom: 1,
            borderColor: (t) =>
              alpha(BRAND_PRIMARY, t.palette.mode === "light" ? 0.12 : 0.2),
            my: 0.75,
          }}
        />
        <ToothArch
          teeth={LOWER_TEETH}
          selected={selected}
          onToggle={toggle}
          isLower
        />
      </Box>
    </Box>
  );
}

export default function ToothChartSelector({
  value,
  onChange,
  multiple = true,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [anchor, setAnchor] = useState(null);
  const summary = summarizeToothSelection(value);
  const open = Boolean(anchor);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
          justifyContent: "flex-start",
          textTransform: "none",
          borderColor: summary ? "primary.main" : "divider",
          bgcolor: summary
            ? alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.06 : 0.12)
            : "background.paper",
        }}
      >
        <Box
          component="span"
          sx={{
            width: "100%",
            textAlign: "left",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {summary || t("toothChart.select")}
        </Box>
      </Button>
      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: { borderRadius: 2, maxWidth: "calc(100vw - 24px)" },
          },
        }}
      >
        <ToothChart
          value={value}
          onChange={(next) => {
            onChange(next);
          }}
          multiple={multiple}
        />
      </Popover>
    </>
  );
}
