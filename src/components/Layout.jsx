import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  Drawer,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LOGIN_PATH } from "@/config/authPaths";
import { BUTTON_PILL_RADIUS } from "@/constants/shape";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { MainLayoutProvider } from "@/context/MainLayoutContext";
import SidebarNav from "@/components/common/SidebarNav";
import SidebarBrand from "@/components/layout/SidebarBrand";
import AdminAppBar from "@/components/layout/AdminAppBar";
import LockScreenGate from "@/components/layout/LockScreenGate";
import PageTransition from "@/components/common/PageTransition";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import { toast } from "@/utils/toast";
import { flatNav } from "@/config/nav";
import {
  APP_BAR_HEIGHT,
  DRAWER_WIDTH,
  DRAWER_WIDTH_MOBILE,
  PAGE_PADDING,
} from "@/constants/layout";

const SIDEBAR_OPEN_KEY = "arrow-sidebar-open";

function readSidebarOpenPreference() {
  try {
    const stored = localStorage.getItem(SIDEBAR_OPEN_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined" && window.matchMedia("(max-width:899.95px)").matches) {
    return false;
  }
  return true;
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(readSidebarOpenPreference);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const persistSidebarOpen = (open) => {
    try {
      localStorage.setItem(SIDEBAR_OPEN_KEY, String(open));
    } catch {
      /* ignore */
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      persistSidebarOpen(next);
      return next;
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    persistSidebarOpen(false);
  };

  const isSelected = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const closeMobile = () => {
    if (isMobile) closeSidebar();
  };

  const handleLogoutClick = async () => {
    closeMobile();
    const ok = await confirm({
      title: t("layout.logoutTitle"),
      message: t("layout.logoutBody"),
      confirmLabel: t("layout.logoutConfirm"),
      confirmColor: "primary",
    });
    if (!ok) return;
    logout();
    navigate(LOGIN_PATH);
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SidebarBrand onNavigate={closeMobile} />
      <Divider sx={{ mx: 1.5 }} />
      <Box className="sidebar-scroll" sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <SidebarNav onNavigate={closeMobile} />
      </Box>
    </Box>
  );

  const activeNav = flatNav.find((n) => isSelected(n.path));
  const pageTitle = activeNav
    ? t(activeNav.labelKey, { defaultValue: "Admin" })
    : t("nav.admin");

  useDocumentTitle(pageTitle);

  useKeyboardShortcuts({
    onShowHelp: () => {
      toast.info(
        t("layout.shortcutsHelp", {
          defaultValue: "/ or ⌘K — focus search\n? — keyboard shortcuts",
        })
      );
    },
  });

  const drawerTransition = theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  });
  const mainOffset = !isMobile && sidebarOpen ? DRAWER_WIDTH : 0;

  return (
    <MainLayoutProvider mainOffset={mainOffset}>
    <LockScreenGate>
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        width: "100%",
        maxWidth: "100%",
        bgcolor: "background.default",
        position: "relative",
        overflowX: "clip",
      }}
    >
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "absolute",
          left: -9999,
          top: 8,
          zIndex: 9999,
          px: 2,
          py: 1,
          bgcolor: "background.paper",
          color: "text.primary",
          textDecoration: "none",
          borderRadius: BUTTON_PILL_RADIUS,
          boxShadow: 2,
          fontSize: "0.875rem",
          fontWeight: 600,
          "&:focus": {
            left: 8,
            outline: 2,
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
      >
        {t("layout.skipToMain", { defaultValue: "Skip to main content" })}
      </Box>
      <Box className="arrow-ambient arrow-ambient--primary" aria-hidden />
      <Box className="arrow-ambient arrow-ambient--secondary" aria-hidden />

      <AdminAppBar
        pageTitle={pageTitle}
        user={user}
        sidebarOpen={sidebarOpen}
        mainOffset={mainOffset}
        drawerTransition={drawerTransition}
        onMenuClick={toggleSidebar}
        onLogout={handleLogoutClick}
      />

      <Box component="nav" sx={{ width: { md: sidebarOpen ? DRAWER_WIDTH : 0 }, flexShrink: 0 }}>
        <Drawer
          variant="temporary"
          open={isMobile && sidebarOpen}
          onClose={closeSidebar}
          ModalProps={{ keepMounted: true, disableScrollLock: true }}
          SlideProps={{ timeout: { enter: 320, exit: 240 } }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH_MOBILE,
              maxWidth: "88vw",
              boxShadow: `8px 0 32px ${alpha(theme.palette.primary.main, 0.12)}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={!isMobile && sidebarOpen}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              bgcolor: "background.paper",
              backgroundImage:
                theme.palette.mode === "light"
                  ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 28%)`
                  : `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 35%)`,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          minWidth: 0,
          maxWidth: "100%",
          p: PAGE_PADDING,
          pb: {
            xs: "calc(10px + env(safe-area-inset-bottom, 0px))",
            sm: 2,
            md: 2.5,
          },
          width: { xs: "100%", md: `calc(100% - ${mainOffset}px)` },
          mt: `${APP_BAR_HEIGHT}px`,
          position: "relative",
          zIndex: 1,
          transition: drawerTransition,
        }}
      >
        <PageTransition>
          <Outlet />
        </PageTransition>
      </Box>

      <ConfirmDialog />
    </Box>
    </LockScreenGate>
    </MainLayoutProvider>
  );
}
