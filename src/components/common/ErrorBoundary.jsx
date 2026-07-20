import { Component } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ActionButton from "@/components/common/ActionButton";
import { glassAccentBarSx, glassPanelSx } from "@/constants/glassSurface";
import { transition } from "@/constants/motion";
import { BRAND_PRIMARY, BRAND_SECONDARY } from "@/theme";
import { useTranslation } from "@/context/LanguageContext";
import {
  SUPPORT_CONTACT_LABEL,
  SUPPORT_VIBER_NUMBER,
  buildErrorSupportMessage,
  openViberSupport,
} from "@/utils/errorSupport";
import { toast } from "@/utils/toast";

function ErrorFallbackView({ error, errorInfo, onReset, onReload }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isLight = theme.palette.mode === "light";
  const errorMessage = error?.message || String(error || "");
  const componentStack = errorInfo?.componentStack || error?.stack || "";
  const supportMessage = buildErrorSupportMessage(error, { componentStack });

  const handleGoHome = () => {
    window.location.reload();
  };

  const handleContactViber = async () => {
    await openViberSupport(supportMessage, {
      onCopied: () => {
        toast.success(
          t("errorBoundary.viberCopied", {
            defaultValue: "Error details copied — send in Viber chat.",
          })
        );
      },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 4, sm: 6 },
        position: "relative",
        overflow: "hidden",
        bgcolor: isLight ? alpha(BRAND_PRIMARY, 0.03) : alpha("#0f0c14", 0.98),
        backgroundImage: isLight
          ? `radial-gradient(ellipse 80% 60% at 50% -10%, ${alpha(BRAND_PRIMARY, 0.14)} 0%, transparent 55%),
             radial-gradient(ellipse 50% 40% at 100% 100%, ${alpha(BRAND_SECONDARY, 0.1)} 0%, transparent 50%)`
          : `radial-gradient(ellipse 80% 60% at 50% -10%, ${alpha(BRAND_PRIMARY, 0.22)} 0%, transparent 55%),
             radial-gradient(ellipse 50% 40% at 0% 100%, ${alpha(BRAND_SECONDARY, 0.14)} 0%, transparent 50%)`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "12%",
          right: "8%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.06 : 0.12),
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "6%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          bgcolor: alpha(BRAND_SECONDARY, isLight ? 0.08 : 0.14),
          filter: "blur(40px)",
          pointerEvents: "none",
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
        <Box
          sx={{
            width: 72,
            height: 72,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b4235a",
            background: isLight
              ? `linear-gradient(145deg, ${alpha("#b4235a", 0.1)} 0%, ${alpha(BRAND_PRIMARY, 0.08)} 100%)`
              : `linear-gradient(145deg, ${alpha("#b4235a", 0.22)} 0%, ${alpha(BRAND_PRIMARY, 0.16)} 100%)`,
            border: `1px solid ${alpha("#b4235a", isLight ? 0.18 : 0.32)}`,
            boxShadow: `0 8px 24px ${alpha("#b4235a", isLight ? 0.12 : 0.2)}`,
          }}
        >
          <ErrorOutlineRoundedIcon sx={{ fontSize: 36 }} />
        </Box>

        <Box sx={{ ...glassAccentBarSx(theme), mx: "auto", mb: 1.5 }} />

        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.45rem" },
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {t("errorBoundary.title", { defaultValue: "Something went wrong" })}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1.25, lineHeight: 1.65, maxWidth: 360, mx: "auto" }}
        >
          {t("errorBoundary.subtitle", {
            defaultValue:
              "An unexpected error occurred while loading this page. Try again or return to admin.",
          })}
        </Typography>

        {errorMessage ? (
          <Box
            sx={{
              mt: 2,
              px: 1.5,
              py: 1.25,
              borderRadius: 1.5,
              textAlign: "left",
              maxWidth: 400,
              mx: "auto",
              bgcolor: isLight ? alpha("#b4235a", 0.05) : alpha("#b4235a", 0.12),
              border: `1px solid ${alpha("#b4235a", isLight ? 0.14 : 0.24)}`,
            }}
          >
            <Typography
              variant="caption"
              color="error.main"
              fontWeight={700}
              sx={{ display: "block", mb: 0.5 }}
            >
              {t("errorBoundary.errorSummary", { defaultValue: "Error summary" })}
            </Typography>
            <Typography
              component="pre"
              variant="caption"
              sx={{
                m: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                color: "text.secondary",
                lineHeight: 1.5,
                maxHeight: 120,
                overflow: "auto",
              }}
            >
              {errorMessage}
            </Typography>
          </Box>
        ) : null}

        {SUPPORT_VIBER_NUMBER ? (
        <Box
          sx={{
            mt: 2,
            px: 1.5,
            py: 1.5,
            borderRadius: 2,
            maxWidth: 400,
            mx: "auto",
            bgcolor: isLight ? alpha("#7360f2", 0.08) : alpha("#7360f2", 0.16),
            border: `1px solid ${alpha("#7360f2", isLight ? 0.22 : 0.34)}`,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.25, lineHeight: 1.55 }}>
            {t("errorBoundary.contactNote", {
              defaultValue:
                "Contact support on Viber — your error details will be included in the message.",
            })}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<ChatBubbleOutlineRoundedIcon />}
            onClick={handleContactViber}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 999,
              py: 1,
              bgcolor: "#7360f2",
              boxShadow: `0 4px 14px ${alpha("#7360f2", 0.35)}`,
              "&:hover": {
                bgcolor: "#5e4ed4",
                boxShadow: `0 6px 18px ${alpha("#7360f2", 0.42)}`,
              },
            }}
          >
            {t("errorBoundary.contactViber", {
              defaultValue: "Message {{contact}} on Viber",
              contact: SUPPORT_CONTACT_LABEL || "support",
            })}
          </Button>
        </Box>
        ) : null}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.25}
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          <Button
            variant="outlined"
            startIcon={<ReplayRoundedIcon />}
            onClick={onReset}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 999,
              px: 2,
              borderColor: alpha(BRAND_PRIMARY, isLight ? 0.28 : 0.38),
              color: "text.primary",
              transition: transition("transform, box-shadow, border-color, background-color"),
              "&:hover": {
                borderColor: alpha(BRAND_PRIMARY, isLight ? 0.42 : 0.52),
                bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.06 : 0.12),
                transform: "translateY(-1px)",
              },
            }}
          >
            {t("errorBoundary.tryAgain", { defaultValue: "Try again" })}
          </Button>
          <ActionButton intent="confirm" startIcon={<RefreshRoundedIcon />} onClick={onReload}>
            {t("errorBoundary.reload", { defaultValue: "Reload page" })}
          </ActionButton>
        </Stack>

        <Button
          startIcon={<HomeOutlinedIcon />}
          onClick={handleGoHome}
          sx={{
            mt: 2,
            textTransform: "none",
            fontWeight: 600,
            color: "text.secondary",
            borderRadius: 999,
            px: 1.5,
            transition: transition("color, background-color"),
            "&:hover": {
              color: BRAND_PRIMARY,
              bgcolor: alpha(BRAND_PRIMARY, isLight ? 0.06 : 0.12),
            },
          }}
        >
          {t("errorBoundary.goHome", { defaultValue: "Reload page" })}
        </Button>
      </Paper>
    </Box>
  );
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error, info) {
    this.setState({ errorInfo: info });
    if (typeof window !== "undefined" && window.__arrowTrackError) {
      window.__arrowTrackError(error, { componentStack: info?.componentStack });
    }
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <ErrorFallbackView
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        onReset={this.handleReset}
        onReload={this.handleReload}
      />
    );
  }
}
