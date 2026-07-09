import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  InputAdornment,
  Paper,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ActionButton from "@/components/common/ActionButton";
import { LOGIN_PATH } from "@/config/authPaths";
import { useAuth } from "@/context/AuthContext";
import { useLockScreen } from "@/context/LockScreenContext";
import { useTranslation } from "@/context/LanguageContext";
import { ProTextField } from "@/components/common/form";
import { inputAdornmentSx } from "@/components/common/form/fieldStyles";
import { BRAND_PRIMARY } from "@/theme";
import { userRoleLabel } from "@/utils/roleDisplay";
import { toast, getErrorMessage } from "@/utils/toast";

function initials(username) {
  if (!username) return "?";
  const parts = String(username).trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

export default function LockScreenOverlay() {
  const { user, logout } = useAuth();
  const { unlock } = useLockScreen();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    try {
      await unlock(password);
      setPassword("");
      toast.success(t("lockScreen.unlockedToast"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("lockScreen.wrongPassword")));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate(LOGIN_PATH, { replace: true });
  };

  const roleLabel = userRoleLabel(user);
  const profileSrc = user?.profile || user?.profile_url;

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label={t("lockScreen.title")}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal + 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? alpha(theme.palette.grey[900], 0.55)
            : alpha(theme.palette.common.black, 0.72),
        backdropFilter: "blur(10px)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          boxShadow: (theme) =>
            `0 24px 64px ${alpha(theme.palette.common.black, 0.22)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(BRAND_PRIMARY, 0.1),
              color: BRAND_PRIMARY,
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Avatar
            src={profileSrc || undefined}
            alt={user?.username || ""}
            sx={{
              width: 72,
              height: 72,
              mb: 1.5,
              fontWeight: 700,
              bgcolor: alpha(BRAND_PRIMARY, 0.12),
              color: BRAND_PRIMARY,
            }}
          >
            {initials(user?.username)}
          </Avatar>
          <Typography variant="h6" fontWeight={700} textAlign="center">
            {user?.username}
          </Typography>
          {roleLabel ? (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {roleLabel}
            </Typography>
          ) : null}
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            {t("lockScreen.subtitle")}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleUnlock} noValidate>
          <ProTextField
            fullWidth
            autoFocus
            label={t("lockScreen.password")}
            placeholder={t("auth.password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            sx={{ mb: 2.5 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={inputAdornmentSx(theme, "start")}>
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <ActionButton
            fullWidth
            type="submit"
            intent="auth"
            size="large"
            disabled={!password.trim()}
            loading={loading}
            sx={{ py: 1.4 }}
          >
            {loading ? t("lockScreen.unlocking") : t("lockScreen.unlock")}
          </ActionButton>
        </Box>

        <Button
          fullWidth
          color="inherit"
          startIcon={<LogoutOutlinedIcon />}
          sx={{ mt: 2, color: "text.secondary" }}
          onClick={handleSignOut}
        >
          {t("lockScreen.signOut")}
        </Button>
      </Paper>
    </Box>
  );
}
