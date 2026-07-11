import { Box, Button, Chip, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ActionButton from "@/components/common/ActionButton";
import { glassAccentBarSx, glassPanelSx } from "@/constants/glassSurface";
import { transition } from "@/constants/motion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { BRAND_PRIMARY, BRAND_SECONDARY } from "@/theme";

function ToothIcon({ size = 16, color = BRAND_PRIMARY }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      sx={{ width: size, height: size, display: "block", flexShrink: 0 }}
    >
      <path
        d="M12 2.5c3.8 0 6.2 2.6 6.2 5.8 0 2.1-.7 3.8-1.4 5.2-.5 1-1 1.9-1.2 2.8-.3 1.3-.2 2.4.1 3.2.2.6-.2 1.2-.8 1.2h-5.8c-.6 0-1-.6-.8-1.2.3-.8.4-1.9.1-3.2-.2-.9-.7-1.8-1.2-2.8-.7-1.4-1.4-3.1-1.4-5.2C5.8 5.1 8.2 2.5 12 2.5z"
        fill={color}
        fillOpacity={0.18}
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </Box>
  );
}

function DentalNotFoundIllustration({ isLight }) {
  const enamel = isLight ? "#ffffff" : "#f4f7fb";
  const enamelStroke = alpha(BRAND_PRIMARY, isLight ? 0.3 : 0.48);
  const shadow = alpha(BRAND_PRIMARY, isLight ? 0.1 : 0.26);
  const accent = alpha(BRAND_SECONDARY, isLight ? 0.82 : 0.92);
  const muted = alpha(BRAND_PRIMARY, isLight ? 0.14 : 0.24);

  const toothPath =
    "M0 0 C8 0 13 6 13 14 C13 20 11 24 8 26 L8 30 C8 34 5 37 0 37 C-5 37 -8 34 -8 30 L-8 26 C-11 24 -13 20 -13 14 C-13 6 -8 0 0 0 Z";

  const teeth = [
    { x: 52, y: 58, scale: 0.92, rotate: -8 },
    { x: 92, y: 48, scale: 0.98, rotate: -3 },
    { x: 140, y: 44, scale: 1, rotate: 0, missing: true },
    { x: 188, y: 48, scale: 0.98, rotate: 3 },
    { x: 228, y: 58, scale: 0.92, rotate: 8 },
  ];

  return (
    <Box
      component="svg"
      viewBox="0 0 280 120"
      aria-hidden
      sx={{
        width: "100%",
        maxWidth: 300,
        height: "auto",
        display: "block",
        mx: "auto",
        mb: 1,
        overflow: "visible",
        "& .dental-notfound-smile": {
          animation: "dentalNotFoundFloat 3.8s ease-in-out infinite",
          transformOrigin: "140px 62px",
        },
        "& .dental-notfound-sparkle": {
          animation: "dentalNotFoundSparkle 2.4s ease-in-out infinite",
        },
        "@keyframes dentalNotFoundFloat": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "@keyframes dentalNotFoundSparkle": {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 0.9 },
        },
      }}
    >
      <defs>
        <linearGradient id="dentalEnamel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={enamel} />
          <stop offset="100%" stopColor={alpha(enamel, 0.9)} />
        </linearGradient>
        <filter id="dentalToothShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={shadow} />
        </filter>
      </defs>

      <g className="dental-notfound-smile">
        {teeth.map((tooth) =>
          tooth.missing ? (
            <g key={tooth.x} transform={`translate(${tooth.x} ${tooth.y}) scale(${tooth.scale}) rotate(${tooth.rotate})`}>
              <path
                d={toothPath}
                fill="none"
                stroke={accent}
                strokeWidth="1.8"
                strokeDasharray="4 3"
                opacity={0.75}
              />
              <circle cx="0" cy="12" r="10" fill={muted} />
              <text
                x="0"
                y="16"
                textAnchor="middle"
                fill={accent}
                fontSize="11"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
              >
                ?
              </text>
            </g>
          ) : (
            <g
              key={tooth.x}
              transform={`translate(${tooth.x} ${tooth.y}) scale(${tooth.scale}) rotate(${tooth.rotate})`}
              filter="url(#dentalToothShadow)"
            >
              <path
                d={toothPath}
                fill="url(#dentalEnamel)"
                stroke={enamelStroke}
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M0 8 L0 20"
                fill="none"
                stroke={alpha(BRAND_PRIMARY, isLight ? 0.08 : 0.16)}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ),
        )}
      </g>

      {/* Dental mirror */}
      <g transform="translate(214, 88)" opacity={isLight ? 0.6 : 0.78}>
        <circle cx="0" cy="0" r="11" fill="none" stroke={accent} strokeWidth="1.6" />
        <circle cx="0" cy="0" r="7" fill={alpha(accent, 0.12)} stroke={accent} strokeWidth="1" />
        <path d="M11 0 L24 0" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="26" cy="0" rx="2.5" ry="3" fill={accent} />
      </g>

      <g className="dental-notfound-sparkle" fill={accent}>
        <path d="M34 28 L36 32 L40 34 L36 36 L34 40 L32 36 L28 34 L32 32 Z" />
        <path d="M246 24 L247.5 27 L250.5 28.5 L247.5 30 L246 33 L244.5 30 L241.5 28.5 L244.5 27 Z" />
      </g>
    </Box>
  );
}

export default function NotFoundPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const inLayout = Boolean(user);
  const isLight = theme.palette.mode === "light";

  const homeTo = user?.is_lab_owner
    ? "/admin"
    : user?.laboratory_name
      ? "/my-laboratory"
      : "/";

  useDocumentTitle(t("errors.notFoundTitle"));

  const pathLabel =
    location.pathname.length > 48
      ? `${location.pathname.slice(0, 45)}…`
      : location.pathname;

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(homeTo);
  };

  return (
    <Box
      sx={{
        minHeight: inLayout ? "min(72vh, 640px)" : "100vh",
        py: inLayout ? { xs: 4, sm: 6 } : { xs: 4, sm: 6 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        position: "relative",
        overflow: "hidden",
        bgcolor: isLight ? alpha(BRAND_PRIMARY, 0.025) : alpha("#0f0c14", 0.98),
        backgroundImage: isLight
          ? `radial-gradient(ellipse 70% 55% at 20% 0%, ${alpha(BRAND_SECONDARY, 0.12)} 0%, transparent 52%),
             radial-gradient(ellipse 60% 50% at 100% 100%, ${alpha(BRAND_PRIMARY, 0.1)} 0%, transparent 48%)`
          : `radial-gradient(ellipse 70% 55% at 20% 0%, ${alpha(BRAND_SECONDARY, 0.16)} 0%, transparent 52%),
             radial-gradient(ellipse 60% 50% at 100% 100%, ${alpha(BRAND_PRIMARY, 0.18)} 0%, transparent 48%)`,
      }}
    >
      {/* Floating tooth watermarks */}
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          aria-hidden
          sx={{
            position: "absolute",
            opacity: isLight ? 0.06 : 0.1,
            transform: `rotate(${i * 18 - 12}deg)`,
            top: `${12 + i * 22}%`,
            left: i === 1 ? "78%" : `${8 + i * 6}%`,
            animation: `tooth404Drift ${5 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
            "@keyframes tooth404Drift": {
              "0%, 100%": { transform: `rotate(${i * 18 - 12}deg) translateY(0)` },
              "50%": { transform: `rotate(${i * 18 - 6}deg) translateY(-8px)` },
            },
          }}
        >
          <ToothIcon size={i === 1 ? 52 : 40} color={BRAND_PRIMARY} />
        </Box>
      ))}

      <Typography
        aria-hidden
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -58%)",
          fontSize: { xs: "clamp(6rem, 26vw, 13rem)", sm: "clamp(8rem, 20vw, 15rem)" },
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.06em",
          userSelect: "none",
          pointerEvents: "none",
          background: isLight
            ? `linear-gradient(180deg, ${alpha(BRAND_PRIMARY, 0.07)} 0%, ${alpha(BRAND_SECONDARY, 0.03)} 100%)`
            : `linear-gradient(180deg, ${alpha(BRAND_PRIMARY, 0.14)} 0%, ${alpha(BRAND_SECONDARY, 0.05)} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404
      </Typography>

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "18%",
          right: "12%",
          width: 160,
          height: 160,
          borderRadius: "50%",
          bgcolor: alpha(BRAND_SECONDARY, isLight ? 0.07 : 0.14),
          filter: "blur(40px)",
        }}
      />

      <Paper
        elevation={0}
        sx={{
          ...glassPanelSx(theme),
          position: "relative",
          zIndex: 1,
          maxWidth: 480,
          width: "100%",
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Chip
          icon={<ToothIcon size={15} color={BRAND_PRIMARY} />}
          label={t("errors.notFoundBadge")}
          size="small"
          sx={{
            mb: 2,
            fontWeight: 700,
            bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.08 : 0.16),
            border: `1px solid ${alpha(BRAND_PRIMARY, isLight ? 0.16 : 0.28)}`,
            color: BRAND_PRIMARY,
            "& .MuiChip-icon": { ml: 0.75 },
          }}
        />

        <DentalNotFoundIllustration isLight={isLight} />

        <Box sx={{ ...glassAccentBarSx(theme), mx: "auto", mb: 1.5 }} />

        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            fontSize: { xs: "1.3rem", sm: "1.5rem" },
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
          }}
        >
          {t("errors.notFoundTitle")}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1.25, lineHeight: 1.65, maxWidth: 360, mx: "auto" }}
        >
          {t("errors.notFoundBody")}
        </Typography>

        {pathLabel && pathLabel !== "/" ? (
          <Box
            sx={{
              mt: 2,
              px: 1.5,
              py: 0.875,
              borderRadius: 1.5,
              display: "inline-block",
              maxWidth: "100%",
              bgcolor: isLight ? alpha(BRAND_PRIMARY, 0.05) : alpha(BRAND_PRIMARY, 0.12),
              border: `1px dashed ${alpha(BRAND_PRIMARY, isLight ? 0.2 : 0.32)}`,
            }}
          >
            <Typography
              variant="caption"
              component="code"
              sx={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                color: "text.secondary",
                wordBreak: "break-all",
              }}
            >
              {pathLabel}
            </Typography>
          </Box>
        ) : null}

        {user ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={handleGoBack}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 999,
                px: 2,
                borderColor: alpha(BRAND_PRIMARY, isLight ? 0.28 : 0.38),
                transition: transition("transform, box-shadow, border-color, background-color"),
                "&:hover": {
                  borderColor: alpha(BRAND_PRIMARY, isLight ? 0.42 : 0.52),
                  bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.06 : 0.12),
                  transform: "translateY(-1px)",
                },
              }}
            >
              {t("errors.goBack")}
            </Button>
            <ActionButton
              component={Link}
              to={homeTo}
              intent="confirm"
              startIcon={<HomeOutlinedIcon />}
            >
              {user?.is_lab_owner
                ? t("nav.admin")
                : user?.laboratory_name
                  ? t("nav.myLaboratory")
                  : t("nav.admin")}
            </ActionButton>
          </Stack>
        ) : null}
      </Paper>
    </Box>
  );
}
