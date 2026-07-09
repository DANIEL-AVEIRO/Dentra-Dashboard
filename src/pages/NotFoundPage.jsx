import { Box, Button, Chip, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ExploreOffRoundedIcon from "@mui/icons-material/ExploreOffRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ActionButton from "@/components/common/ActionButton";
import { glassAccentBarSx, glassPanelSx } from "@/constants/glassSurface";
import { transition } from "@/constants/motion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { BRAND_PRIMARY, BRAND_SECONDARY } from "@/theme";

function RouteLostIllustration({ isLight }) {
  const stroke = alpha(BRAND_PRIMARY, isLight ? 0.35 : 0.55);
  const strokeMuted = alpha(BRAND_PRIMARY, isLight ? 0.18 : 0.28);
  const accent = alpha(BRAND_SECONDARY, isLight ? 0.75 : 0.9);

  return (
    <Box
      component="svg"
      viewBox="0 0 240 120"
      aria-hidden
      sx={{
        width: "100%",
        maxWidth: 280,
        height: "auto",
        display: "block",
        mx: "auto",
        mb: 1,
        "& .notfound-route-main": {
          animation: "notfoundRouteDash 2.4s linear infinite",
        },
        "@keyframes notfoundRouteDash": {
          to: { strokeDashoffset: -28 },
        },
      }}
    >
      <defs>
        <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BRAND_PRIMARY} stopOpacity={isLight ? 0.5 : 0.7} />
          <stop offset="100%" stopColor={BRAND_SECONDARY} stopOpacity={isLight ? 0.65 : 0.85} />
        </linearGradient>
      </defs>

      {/* Grid dots */}
      {[32, 72, 112, 152, 192].map((x) =>
        [24, 56, 88].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.2} fill={strokeMuted} />
        ))
      )}

      <path
        className="notfound-route-main"
        d="M 20 88 C 48 88, 56 52, 88 52 S 128 28, 160 40 S 196 72, 220 48"
        fill="none"
        stroke="url(#routeGlow)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 6"
      />

      {/* Dead-end branch */}
      <path
        d="M 160 40 L 160 92"
        fill="none"
        stroke={strokeMuted}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 5"
      />

      {/* X marker at dead end */}
      <g transform="translate(160, 96)">
        <circle r="14" fill={alpha("#b4235a", isLight ? 0.1 : 0.2)} stroke={alpha("#b4235a", 0.45)} strokeWidth="1.5" />
        <path d="M -5 -5 L 5 5 M 5 -5 L -5 5" stroke="#b4235a" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Package at start */}
      <g transform="translate(20, 88)">
        <rect x="-10" y="-12" width="20" height="16" rx="3" fill={alpha(BRAND_PRIMARY, isLight ? 0.12 : 0.22)} stroke={accent} strokeWidth="1.5" />
        <path d="M -10 -6 L 0 -10 L 10 -6" fill="none" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
      </g>

      {/* Pin at wrong turn */}
      <g transform="translate(88, 52)">
        <circle r="6" fill={alpha(BRAND_SECONDARY, isLight ? 0.2 : 0.35)} stroke={accent} strokeWidth="1.5" />
        <circle r="2" fill={accent} />
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
    navigate("/");
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
      {/* Watermark 404 */}
      <Typography
        aria-hidden
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -54%)",
          fontSize: { xs: "clamp(7rem, 28vw, 14rem)", sm: "clamp(9rem, 22vw, 16rem)" },
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.06em",
          userSelect: "none",
          pointerEvents: "none",
          background: isLight
            ? `linear-gradient(180deg, ${alpha(BRAND_PRIMARY, 0.09)} 0%, ${alpha(BRAND_SECONDARY, 0.04)} 100%)`
            : `linear-gradient(180deg, ${alpha(BRAND_PRIMARY, 0.16)} 0%, ${alpha(BRAND_SECONDARY, 0.06)} 100%)`,
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
          maxWidth: 460,
          width: "100%",
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Chip
          icon={<ExploreOffRoundedIcon sx={{ fontSize: "16px !important" }} />}
          label={t("errors.notFoundBadge", { defaultValue: "Off route" })}
          size="small"
          sx={{
            mb: 2,
            fontWeight: 700,
            bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.08 : 0.16),
            border: `1px solid ${alpha(BRAND_PRIMARY, isLight ? 0.16 : 0.28)}`,
            color: BRAND_PRIMARY,
            "& .MuiChip-icon": { color: BRAND_PRIMARY },
          }}
        />

        <RouteLostIllustration isLight={isLight} />

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
          sx={{ mt: 1.25, lineHeight: 1.65, maxWidth: 340, mx: "auto" }}
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
              {t("errors.goBack", { defaultValue: "Go back" })}
            </Button>
            <ActionButton component={Link} to="/" intent="confirm" startIcon={<HomeOutlinedIcon />}>
              {t("nav.admin")}
            </ActionButton>
          </Stack>
        ) : null}
      </Paper>
    </Box>
  );
}
