import { useId, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { useTranslation } from "@/context/LanguageContext";
import { BRAND_PRIMARY } from "@/theme";
import {
  LOWER_TEETH,
  UPPER_TEETH,
  formatToothSelection,
  parseToothSelection,
  summarizeToothSelection,
} from "@/components/cases/toothChartData";

/** Occlusal-style silhouettes — Exocad / dental CAD feel */
const TOOTH_PATHS = {
  incisor:
    "M-5.5 -16 C-4.5 -18 4.5 -18 5.5 -16 L7 -4 C7.5 2 6 10 4.5 14 C3 17 1.5 18 0 18 C-1.5 18 -3 17 -4.5 14 C-6 10 -7.5 2 -7 -4 Z",
  canine:
    "M0 -19 C2.5 -18 5.5 -14 6.5 -8 L7.5 2 C8 8 6 13 3.5 16 C1.5 18 0 18.5 0 18.5 C0 18.5 -1.5 18 -3.5 16 C-6 13 -8 8 -7.5 2 L-6.5 -8 C-5.5 -14 -2.5 -18 0 -19 Z",
  premolar:
    "M-7.5 -15 C-4 -18 4 -18 7.5 -15 C10 -12 11 -6 10.5 0 C10 6 8 12 5 15.5 C2.5 18 0 18.5 0 18.5 C0 18.5 -2.5 18 -5 15.5 C-8 12 -10 6 -10.5 0 C-11 -6 -10 -12 -7.5 -15 Z",
  molar:
    "M-11 -14 C-7 -17.5 -2.5 -18.5 0 -18.5 C2.5 -18.5 7 -17.5 11 -14 C13.5 -11 14.5 -5 14 1 C13.5 7 11 12 7.5 15.5 C4 18.5 1 19 0 19 C-1 19 -4 18.5 -7.5 15.5 C-11 12 -13.5 7 -14 1 C-14.5 -5 -13.5 -11 -11 -14 Z",
};

const TYPE_SIZE = {
  incisor: { w: 20, h: 34 },
  canine: { w: 22, h: 36 },
  premolar: { w: 26, h: 36 },
  molar: { w: 30, h: 38 },
};

const ARCH = {
  width: 520,
  height: 118,
  padX: 22,
};

/** Parabolic dental arch — ∪ upper / ∩ lower (patient frontal view) */
function getArchPose(index, total, isLower) {
  const mid = (total - 1) / 2;
  const t = mid === 0 ? 0 : (index - mid) / mid; // -1 … 1
  const half = ARCH.width / 2 - ARCH.padX;
  const depth = 52;
  const x = ARCH.width / 2 + t * half;
  const curve = t * t;
  const y = isLower
    ? ARCH.height - 58 - curve * depth
    : 10 + curve * depth;
  const rotate = t * (isLower ? 36 : -36);
  return {
    left: `${(x / ARCH.width) * 100}%`,
    top: y,
    rotate,
  };
}

function ToothShape({ tooth, selected, onToggle, isLower, uid, pose }) {
  const theme = useTheme();
  const size = TYPE_SIZE[tooth.type] ?? TYPE_SIZE.premolar;
  const path = TOOTH_PATHS[tooth.type] ?? TOOTH_PATHS.premolar;
  const fillId = `${uid}-fill-${tooth.fdi}`;
  const glossId = `${uid}-gloss-${tooth.fdi}`;
  const isLight = theme.palette.mode === "light";

  const base = selected ? BRAND_PRIMARY : isLight ? "#E8EEF5" : "#2A3444";
  const mid = selected
    ? alpha(BRAND_PRIMARY, isLight ? 0.72 : 0.85)
    : isLight
      ? "#F7FAFD"
      : "#3A4658";
  const tip = selected
    ? alpha("#fff", isLight ? 0.55 : 0.35)
    : isLight
      ? "#FFFFFF"
      : "#5A6A80";
  const stroke = selected
    ? theme.palette.primary.dark || BRAND_PRIMARY
    : alpha(BRAND_PRIMARY, isLight ? 0.4 : 0.55);

  const { left, top, rotate } = pose;

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onToggle(tooth.fdi)}
      aria-label={tooth.fdi}
      aria-pressed={selected}
      sx={{
        position: "absolute",
        left,
        top,
        border: 0,
        p: 0,
        m: 0,
        bgcolor: "transparent",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: isLower ? "flex-start" : "flex-end",
        gap: 0.3,
        width: size.w + 4,
        transform: `translate(-50%, 0) rotate(${rotate}deg)`,
        transformOrigin: isLower ? "50% 0%" : "50% 100%",
        transition: "transform 0.15s ease, filter 0.15s ease",
        filter: selected
          ? `drop-shadow(0 2px 6px ${alpha(BRAND_PRIMARY, 0.45)})`
          : "drop-shadow(0 1px 2px rgba(0,0,0,0.12))",
        zIndex: selected ? 3 : 1,
        "&:hover": {
          transform: `translate(-50%, 0) rotate(${rotate}deg) scale(1.06)`,
          zIndex: 4,
        },
        "&:focus-visible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 3,
          borderRadius: 1,
        },
      }}
    >
      {!isLower ? (
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.62rem",
            fontWeight: selected ? 800 : 650,
            color: selected ? "primary.main" : "text.secondary",
            lineHeight: 1,
            letterSpacing: 0.2,
          }}
        >
          {tooth.fdi}
        </Typography>
      ) : null}
      <Box
        component="svg"
        viewBox="-18 -22 36 44"
        sx={{
          width: size.w,
          height: size.h,
          display: "block",
          transform: isLower ? "scaleY(-1)" : "none",
        }}
      >
        <defs>
          <linearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tip} />
            <stop offset="42%" stopColor={mid} />
            <stop offset="100%" stopColor={base} />
          </linearGradient>
          <radialGradient id={glossId} cx="35%" cy="28%" r="55%">
            <stop offset="0%" stopColor="#fff" stopOpacity={selected ? 0.45 : 0.55} />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="0"
          cy="16"
          rx="9"
          ry="2.2"
          fill={alpha("#000", isLight ? 0.08 : 0.25)}
          opacity={0.7}
        />
        <path
          d={path}
          fill={`url(#${fillId})`}
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path d={path} fill={`url(#${glossId})`} stroke="none" />
        {(tooth.type === "molar" || tooth.type === "premolar") && (
          <path
            d={
              tooth.type === "molar"
                ? "M-5 -5 Q0 -8 5 -5 M-6 3 Q0 0 6 3"
                : "M-3.5 -4 Q0 -6.5 3.5 -4"
            }
            fill="none"
            stroke={alpha(stroke, 0.45)}
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        )}
      </Box>
      {isLower ? (
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.62rem",
            fontWeight: selected ? 800 : 650,
            color: selected ? "primary.main" : "text.secondary",
            lineHeight: 1,
            letterSpacing: 0.2,
          }}
        >
          {tooth.fdi}
        </Typography>
      ) : null}
    </Box>
  );
}

function ArchGuide({ isLower, color }) {
  const pad = ARCH.padX;
  const depth = 52;
  const left = pad;
  const right = ARCH.width - pad;
  const cx = ARCH.width / 2;
  const apexY = isLower ? ARCH.height - 50 : 8;
  const endY = isLower ? ARCH.height - 50 - depth : 8 + depth;
  const d = `M ${left} ${endY} Q ${cx} ${apexY} ${right} ${endY}`;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${ARCH.width} ${ARCH.height}`}
      preserveAspectRatio="xMidYMid meet"
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity={0.5}
      />
      <line
        x1={cx}
        y1={isLower ? endY + 8 : apexY}
        x2={cx}
        y2={isLower ? apexY - 8 : endY - 8}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.35}
      />
    </Box>
  );
}

function ToothArch({ teeth, selected, onToggle, isLower, uid }) {
  const theme = useTheme();
  const guideColor = alpha(
    BRAND_PRIMARY,
    theme.palette.mode === "light" ? 0.28 : 0.4,
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: ARCH.width,
        height: ARCH.height,
        mx: "auto",
        overflow: "visible",
      }}
    >
      <ArchGuide isLower={isLower} color={guideColor} />
      {teeth.map((tooth, index) => (
        <ToothShape
          key={tooth.fdi}
          tooth={tooth}
          selected={selected.has(tooth.fdi)}
          onToggle={onToggle}
          isLower={isLower}
          uid={uid}
          pose={getArchPose(index, teeth.length, isLower)}
        />
      ))}
    </Box>
  );
}

export function ToothChart({ value, onChange, multiple = true, onDone }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const uid = useId().replace(/:/g, "");
  const selected = useMemo(() => parseToothSelection(value), [value]);
  const isLight = theme.palette.mode === "light";

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
    <Box
      sx={{
        width: { xs: "min(100vw - 24px, 580px)", sm: 580 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 1.75,
          pb: 1.25,
          background: isLight
            ? `linear-gradient(135deg, ${alpha(BRAND_PRIMARY, 0.08)} 0%, ${alpha("#fff", 0)} 70%)`
            : `linear-gradient(135deg, ${alpha(BRAND_PRIMARY, 0.18)} 0%, transparent 70%)`,
        }}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ letterSpacing: -0.2, mb: 0.35 }}
            >
              {t("toothChart.title")}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              {t("toothChart.hint")}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Button
              size="small"
              variant="outlined"
              onClick={clear}
              disabled={selected.size === 0}
              startIcon={<RestartAltRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: 0.1,
                minWidth: 0,
                height: 30,
                px: 1.25,
                borderRadius: 99,
                borderColor: alpha(BRAND_PRIMARY, isLight ? 0.28 : 0.4),
                color: "primary.main",
                bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.06 : 0.12),
                boxShadow: "none",
                "& .MuiButton-startIcon": { mr: 0.5 },
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.12 : 0.22),
                },
                "&.Mui-disabled": {
                  borderColor: alpha(BRAND_PRIMARY, isLight ? 0.12 : 0.2),
                  color: alpha(BRAND_PRIMARY, isLight ? 0.35 : 0.4),
                  bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.03 : 0.06),
                },
              }}
            >
              {t("toothChart.clear")}
            </Button>
            {onDone ? (
              <IconButton
                size="small"
                onClick={onDone}
                aria-label={t("common.close", { defaultValue: "Close" })}
                sx={{
                  color: "text.secondary",
                  border: `1px solid ${alpha(BRAND_PRIMARY, isLight ? 0.14 : 0.28)}`,
                  bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.03 : 0.08),
                  "&:hover": {
                    bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.08 : 0.16),
                  },
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            ) : null}
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ px: 1.5, pb: 1.75, overflow: "visible" }}>
        <Box
          sx={{
            position: "relative",
            px: { xs: 1.5, sm: 2.25 },
            py: 1.75,
            borderRadius: 2.5,
            overflow: "visible",
            background: isLight
              ? `radial-gradient(ellipse at 50% 38%, ${alpha(BRAND_PRIMARY, 0.1)} 0%, transparent 58%), linear-gradient(180deg, #F8FAFC 0%, #EEF3F8 100%)`
              : `radial-gradient(ellipse at 50% 38%, ${alpha(BRAND_PRIMARY, 0.16)} 0%, transparent 58%), linear-gradient(180deg, #1C2533 0%, #121820 100%)`,
            border: `1px solid ${alpha(BRAND_PRIMARY, isLight ? 0.14 : 0.28)}`,
            boxShadow: isLight
              ? `inset 0 1px 0 ${alpha("#fff", 0.9)}, inset 0 -12px 28px ${alpha("#0B1A2B", 0.04)}`
              : `inset 0 1px 0 ${alpha("#fff", 0.06)}`,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ px: 1.75, mb: 0.75 }}
          >
            {["R", "L"].map((side) => (
              <Box
                key={side}
                sx={{
                  px: 0.75,
                  py: 0.15,
                  borderRadius: 99,
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  letterSpacing: 0.4,
                  color: alpha(BRAND_PRIMARY, isLight ? 0.65 : 0.8),
                  bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.08 : 0.16),
                }}
              >
                {side}
              </Box>
            ))}
          </Stack>
          <ToothArch
            teeth={UPPER_TEETH}
            selected={selected}
            onToggle={toggle}
            uid={uid}
          />
          <Box
            sx={{
              height: 1,
              my: 0.25,
              mx: 4,
              background: `linear-gradient(90deg, transparent, ${alpha(
                BRAND_PRIMARY,
                isLight ? 0.28 : 0.4,
              )}, transparent)`,
            }}
          />
          <ToothArch
            teeth={LOWER_TEETH}
            selected={selected}
            onToggle={toggle}
            isLower
            uid={uid}
          />
        </Box>
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
  const isLight = theme.palette.mode === "light";

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
            ? alpha(BRAND_PRIMARY, isLight ? 0.06 : 0.12)
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
            elevation: 0,
            sx: {
              borderRadius: 3,
              maxWidth: "calc(100vw - 24px)",
              overflow: "hidden",
              border: `1px solid ${alpha(BRAND_PRIMARY, isLight ? 0.14 : 0.28)}`,
              boxShadow: isLight
                ? `0 4px 6px ${alpha("#0B1A2B", 0.04)}, 0 18px 40px ${alpha("#0B1A2B", 0.12)}`
                : `0 18px 40px ${alpha("#000", 0.45)}`,
              bgcolor: "background.paper",
            },
          },
        }}
      >
        <ToothChart
          value={value}
          onChange={onChange}
          multiple={multiple}
          onDone={() => setAnchor(null)}
        />
      </Popover>
    </>
  );
}
