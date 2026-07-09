import { useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useThemeMode } from "@/context/ThemeContext";
import { useTranslation } from "@/context/LanguageContext";
import { useFullscreen } from "@/hooks/useFullscreen";
import { APP_BAR_HEIGHT } from "@/constants/layout";
import HeaderIconButton from "@/components/layout/HeaderIconButton";
import HeaderUserMenu from "@/components/layout/HeaderUserMenu";
import { useLockScreen } from "@/context/LockScreenContext";

function HeaderDivider() {
  return (
    <Divider
      orientation="vertical"
      flexItem
      sx={{
        borderColor: "rgba(255,255,255,0.22)",
        my: 1,
        mx: 0.5,
        display: { xs: "none", sm: "block" },
      }}
    />
  );
}

export default function AdminAppBar({
  pageTitle,
  user,
  sidebarOpen,
  mainOffset = 0,
  drawerTransition,
  onMenuClick,
  onLogout,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isCompactHeader = useMediaQuery(theme.breakpoints.down("sm"));
  const { toggleMode, mode } = useThemeMode();
  const { active: fullscreen, toggle: toggleFullscreen, supported } =
    useFullscreen();
  const { lock } = useLockScreen();
  const [moreAnchor, setMoreAnchor] = useState(null);

  const closeMore = () => setMoreAnchor(null);

  const secondaryControls = (
    <>
      {supported ? (
        <>
          <HeaderIconButton
            title={
              fullscreen
                ? t("header.exitFullscreen")
                : t("header.fullscreen")
            }
            onClick={toggleFullscreen}
            active={fullscreen}
          >
            {fullscreen ? (
              <FullscreenExitIcon sx={{ fontSize: 22 }} />
            ) : (
              <FullscreenIcon sx={{ fontSize: 22 }} />
            )}
          </HeaderIconButton>
          <HeaderDivider />
        </>
      ) : null}

      <HeaderIconButton
        title={t("lockScreen.lock")}
        onClick={lock}
        aria-label={t("lockScreen.lock")}
      >
        <LockOutlinedIcon sx={{ fontSize: 22 }} />
      </HeaderIconButton>

      <HeaderDivider />

      <HeaderIconButton
        title={
          mode === "light" ? t("header.darkMode") : t("header.lightMode")
        }
        onClick={toggleMode}
      >
        {mode === "light" ? (
          <Brightness4Icon sx={{ fontSize: 22 }} />
        ) : (
          <Brightness7Icon sx={{ fontSize: 22 }} />
        )}
      </HeaderIconButton>
    </>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { xs: "100%", md: `calc(100% - ${mainOffset}px)` },
        ml: { xs: 0, md: `${mainOffset}px` },
        transition: drawerTransition,
        boxShadow: `0 4px 24px ${alpha("#000", 0.12)}`,
        pt: "env(safe-area-inset-top, 0px)",
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: APP_BAR_HEIGHT, px: { xs: 1, sm: 1.5 } }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: { xs: 0.5, sm: 1 }, flexShrink: 0 }}
          aria-label={
            sidebarOpen
              ? t("header.closeMenu", { defaultValue: "Close menu" })
              : t("header.openMenu")
          }
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? (
            <MenuOpenIcon sx={{ fontSize: 24 }} />
          ) : (
            <MenuIcon sx={{ fontSize: 24 }} />
          )}
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            letterSpacing: "0.01em",
            minWidth: 0,
            fontSize: { xs: "0.95rem", sm: "1.125rem", md: "1.25rem" },
            transition: "opacity 0.15s ease",
          }}
          noWrap
        >
          {pageTitle}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            gap: 0.25,
          }}
        >
          {isCompactHeader ? (
            <>
              <HeaderIconButton
                title={t("header.moreActions", { defaultValue: "More actions" })}
                onClick={(e) => setMoreAnchor(e.currentTarget)}
                aria-label={t("header.moreActions", { defaultValue: "More actions" })}
              >
                <MoreVertIcon sx={{ fontSize: 22 }} />
              </HeaderIconButton>
              <HeaderUserMenu user={user} onLogout={onLogout} showLockInMenu />
              <Menu
                anchorEl={moreAnchor}
                open={Boolean(moreAnchor)}
                onClose={closeMore}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: { minWidth: 220, mt: 0.75 },
                  },
                }}
              >
                {supported ? (
                  <MenuItem
                    onClick={() => {
                      toggleFullscreen();
                      closeMore();
                    }}
                  >
                    <ListItemIcon>
                      {fullscreen ? (
                        <FullscreenExitIcon fontSize="small" />
                      ) : (
                        <FullscreenIcon fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        fullscreen
                          ? t("header.exitFullscreen")
                          : t("header.fullscreen")
                      }
                    />
                  </MenuItem>
                ) : null}
                <MenuItem
                  onClick={() => {
                    lock();
                    closeMore();
                  }}
                >
                  <ListItemIcon>
                    <LockOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t("lockScreen.lock")} />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    toggleMode();
                    closeMore();
                  }}
                >
                  <ListItemIcon>
                    {mode === "light" ? (
                      <Brightness4Icon fontSize="small" />
                    ) : (
                      <Brightness7Icon fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      mode === "light" ? t("header.darkMode") : t("header.lightMode")
                    }
                  />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {secondaryControls}
              <HeaderDivider />
              <HeaderUserMenu user={user} onLogout={onLogout} showLockInMenu={false} />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
