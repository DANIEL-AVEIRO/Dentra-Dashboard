import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslation } from "@/context/LanguageContext";
import { useLockScreen } from "@/context/LockScreenContext";
import { brandFromTheme } from "@/utils/brandPalette";
import { BUTTON_PILL_RADIUS } from "@/constants/shape";
import { transition } from "@/constants/motion";
import { userRoleLabel } from "@/utils/roleDisplay";
import { resolveMediaUrl } from "@/utils/mediaUrl";

function initials(username) {
  if (!username) return "?";
  const parts = String(username).trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

function AccountMenuItem({
  icon: Icon,
  label,
  onClick,
  to,
  endIcon: EndIcon = ChevronRightIcon,
  tone = "default",
}) {
  const theme = useTheme();
  const { primary } = brandFromTheme(theme);
  const isDanger = tone === "danger";

  const iconBg = isDanger
    ? alpha(theme.palette.error.main, theme.palette.mode === "light" ? 0.1 : 0.18)
    : alpha(primary, theme.palette.mode === "light" ? 0.1 : 0.2);
  const iconColor = isDanger ? theme.palette.error.main : primary;

  const itemSx = {
    mx: 0.75,
    my: 0.25,
    py: 1.125,
    px: 1.5,
    gap: 1,
    borderRadius: 1.5,
    transition: transition("background-color, color"),
    color: isDanger ? "error.main" : "text.primary",
    "&:hover": {
      bgcolor: isDanger
        ? alpha(theme.palette.error.main, theme.palette.mode === "light" ? 0.08 : 0.14)
        : alpha(primary, theme.palette.mode === "light" ? 0.06 : 0.12),
    },
  };

  const content = (
    <>
      <ListItemIcon sx={{ minWidth: 0, mr: 0.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            bgcolor: iconBg,
            color: iconColor,
          }}
        >
          <Icon sx={{ fontSize: 19 }} />
        </Box>
      </ListItemIcon>
      <ListItemText
        primary={label}
        sx={{ flex: 1, minWidth: 0, mr: EndIcon ? 0.75 : 0 }}
        primaryTypographyProps={{
          variant: "body2",
          fontWeight: 600,
          lineHeight: 1.3,
        }}
      />
      {EndIcon ? (
        <EndIcon
          sx={{
            fontSize: 18,
            color: isDanger ? "error.light" : "text.disabled",
            ml: "auto",
            flexShrink: 0,
          }}
        />
      ) : null}
    </>
  );

  if (to) {
    return (
      <MenuItem component={RouterLink} to={to} onClick={onClick} sx={itemSx}>
        {content}
      </MenuItem>
    );
  }

  return (
    <MenuItem onClick={onClick} sx={itemSx}>
      {content}
    </MenuItem>
  );
}

export default function HeaderUserMenu({ user, onLogout, showLockInMenu = true }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { primary } = brandFromTheme(theme);
  const { lock } = useLockScreen();
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const roleLabel = userRoleLabel(user);
  const profileSrc =
    resolveMediaUrl(user?.profile) ||
    resolveMediaUrl(user?.profile_url) ||
    user?.profile_url ||
    null;

  const close = () => setAnchor(null);

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("header.accountMenu")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          ml: 0.5,
          pl: 0.75,
          pr: 1,
          py: 0.25,
          border: "none",
          borderRadius: BUTTON_PILL_RADIUS,
          cursor: "pointer",
          bgcolor: open ? "rgba(255,255,255,0.14)" : "transparent",
          color: "inherit",
          font: "inherit",
          transition: transition("background-color, box-shadow"),
          boxShadow: open ? `inset 0 0 0 1px ${alpha("#fff", 0.2)}` : "none",
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
        }}
      >
        <Avatar
          src={profileSrc || undefined}
          alt={user?.username || ""}
          sx={{
            width: 32,
            height: 32,
            fontSize: "0.8rem",
            fontWeight: 700,
            bgcolor: alpha("#fff", 0.22),
            color: "#fff",
            border: `1px solid ${alpha("#fff", 0.35)}`,
          }}
        >
          {initials(user?.username)}
        </Avatar>
        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left", minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 140, lineHeight: 1.2 }}>
            {user?.username}
          </Typography>
          {user?.email ? (
            <Typography
              variant="caption"
              noWrap
              sx={{ maxWidth: 140, display: "block", opacity: 0.85, lineHeight: 1.2 }}
            >
              {user.email}
            </Typography>
          ) : null}
        </Box>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 18,
            opacity: 0.9,
            transition: transition("transform"),
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Box>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={close}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1.25,
              width: 300,
              maxWidth: "calc(100vw - 24px)",
              borderRadius: 2.5,
              overflow: "hidden",
              border: 1,
              borderColor: alpha(primary, theme.palette.mode === "light" ? 0.12 : 0.22),
              bgcolor: "background.paper",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 16px 48px ${alpha(primary, 0.14)}, 0 4px 16px ${alpha("#000", 0.08)}`
                  : `0 16px 48px ${alpha("#000", 0.45)}`,
            },
          },
          list: {
            sx: { py: 0.75 },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.75,
            background:
              theme.palette.mode === "light"
                ? `linear-gradient(135deg, ${alpha(primary, 0.1)} 0%, ${alpha(primary, 0.03)} 100%)`
                : `linear-gradient(135deg, ${alpha(primary, 0.22)} 0%, ${alpha(primary, 0.08)} 100%)`,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Avatar
            src={profileSrc || undefined}
            alt={user?.username || ""}
            sx={{
              width: 48,
              height: 48,
              fontSize: "1rem",
              fontWeight: 700,
              bgcolor: alpha(primary, 0.14),
              color: primary,
              border: `2px solid ${alpha(primary, 0.2)}`,
              boxShadow: `0 4px 14px ${alpha(primary, 0.18)}`,
            }}
          >
            {initials(user?.username)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap lineHeight={1.25}>
              {user?.username}
            </Typography>
            {user?.email ? (
              <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ mt: 0.25 }}>
                {user.email}
              </Typography>
            ) : null}
            {roleLabel ? (
              <Chip
                size="small"
                label={roleLabel}
                sx={{
                  mt: 0.75,
                  height: 22,
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  bgcolor: alpha(primary, theme.palette.mode === "light" ? 0.12 : 0.24),
                  color: primary,
                  border: `1px solid ${alpha(primary, 0.2)}`,
                }}
              />
            ) : null}
          </Box>
        </Box>

        <Box sx={{ py: 0.5 }}>
          <AccountMenuItem
            icon={PersonOutlineIcon}
            label={t("nav.profile")}
            to="/profile"
            onClick={close}
          />
          <AccountMenuItem
            icon={SettingsOutlinedIcon}
            label={t("nav.settings")}
            to="/settings"
            onClick={close}
          />
        </Box>

        {showLockInMenu ? (
          <Divider sx={{ mx: 1.5, borderColor: alpha(primary, 0.1) }} />
        ) : null}
        {showLockInMenu ? (
          <Box sx={{ py: 0.5 }}>
            <AccountMenuItem
              icon={LockOutlinedIcon}
              label={t("lockScreen.lock")}
              onClick={() => {
                close();
                lock();
              }}
            />
          </Box>
        ) : null}

        <Divider sx={{ mx: 1.5, my: 0.5, borderColor: alpha(primary, 0.1) }} />
        <Box
          sx={{
            px: 0.75,
            pb: 0.75,
            pt: 0.25,
          }}
        >
          <AccountMenuItem
            icon={LogoutIcon}
            label={t("nav.logout")}
            tone="danger"
            endIcon={null}
            onClick={() => {
              close();
              onLogout();
            }}
          />
        </Box>
      </Menu>
    </>
  );
}
