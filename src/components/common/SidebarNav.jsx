import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Badge,
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { navSections } from "@/config/nav";
import { trashUrlFromContext } from "@/utils/trashNavigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { filterNavSections } from "@/utils/permissions";
import { searchNavEntries } from "@/utils/navSearch";
import {
  NAV_ICON_SIZE,
  NAV_ITEM_MIN_HEIGHT,
  NAV_LABEL_FONT,
  NAV_SECTION_MIN_HEIGHT,
} from "@/constants/layout";
import { DURATION, EASE_SOFT, transition } from "@/constants/motion";

const STORAGE_KEY = "arrow-sidebar-sections";

const isPathActive = (pathname, path) => {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
};

function navItemTo(item, pathname) {
  if (item.path === "/trash") {
    return trashUrlFromContext({ pathname });
  }
  return item.path;
}

function navBadgeCount() {
  return 0;
}

function getInitialOpenState(pathname, sections) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (Object.keys(saved).length > 0) return saved;
  } catch {
    /* ignore */
  }
  return sections.reduce((acc, section) => {
    acc[section.id] = section.items.some((item) => isPathActive(pathname, item.path));
    return acc;
  }, {});
}

export default function SidebarNav({ onNavigate }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const brandPrimary = theme.palette.primary.main;
  const { user } = useAuth();
  const { pathname } = useLocation();
  const badgeCounts = {};
  const [search, setSearch] = useState("");

  const visibleSections = useMemo(
    () => filterNavSections(navSections, user),
    [user]
  );

  const searchResults = useMemo(
    () => searchNavEntries(visibleSections, search, t),
    [visibleSections, search, t]
  );

  const isSearching = search.trim().length > 0;

  const [openSections, setOpenSections] = useState(() =>
    getInitialOpenState(pathname, visibleSections)
  );

  useEffect(() => {
    if (isSearching) return;
    setOpenSections((prev) => {
      const next = { ...prev };
      let changed = false;
      visibleSections.forEach((section) => {
        if (section.items.some((item) => isPathActive(pathname, item.path))) {
          if (!next[section.id]) {
            next[section.id] = true;
            changed = true;
          }
        }
      });
      return changed ? next : prev;
    });
  }, [pathname, isSearching, visibleSections]);

  useEffect(() => {
    if (!isSearching) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(openSections));
    }
  }, [openSections, isSearching]);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const itemSx = useMemo(
    () => ({
      pl: 2.5,
      pr: 1.5,
      mx: 1,
      mb: 0.25,
      borderRadius: 1,
      minHeight: NAV_ITEM_MIN_HEIGHT,
      transition: transition("background-color, color"),
      "&:hover": {
        bgcolor: alpha(brandPrimary, 0.06),
      },
      "&.Mui-selected": {
        bgcolor: alpha(brandPrimary, 0.12),
        color: brandPrimary,
        boxShadow: `inset 3px 0 0 ${brandPrimary}`,
        "& .MuiListItemIcon-root": { color: brandPrimary },
        "&:hover": {
          bgcolor: alpha(brandPrimary, 0.16),
        },
      },
    }),
    [brandPrimary]
  );

  const headerSx = {
    mx: 1,
    mb: 0.25,
    borderRadius: 1,
    minHeight: NAV_SECTION_MIN_HEIGHT,
    py: 0.375,
    transition: transition("background-color"),
    "&:hover": {
      bgcolor: alpha(brandPrimary, 0.06),
    },
  };

  const handleNavClick = () => {
    setSearch("");
    onNavigate?.();
  };

  return (
    <Box>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          px: 1,
          pt: 0.5,
          pb: 1,
          bgcolor: "background.paper",
        }}
      >
        <TextField
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("nav.searchMenu")}
          inputProps={{ "aria-label": t("nav.searchMenu") }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label={t("common.clear")}
                  onClick={() => setSearch("")}
                  edge="end"
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              fontSize: NAV_LABEL_FONT,
              bgcolor: (theme) =>
                alpha(
                  theme.palette.mode === "dark"
                    ? theme.palette.common.white
                    : theme.palette.common.black,
                  0.04
                ),
            },
          }}
        />
      </Box>

      {isSearching ? (
        <List disablePadding sx={{ px: 0.5 }}>
          {searchResults.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ px: 2, py: 2, textAlign: "center" }}
            >
              {t("nav.searchNoResults")}
            </Typography>
          ) : (
            searchResults.map((entry) => {
              const Icon = entry.icon;
              const selected = isPathActive(pathname, entry.path);
              const badge = navBadgeCount(entry, badgeCounts);
              return (
                <ListItemButton
                  key={`${entry.sectionId}-${entry.path}`}
                  component={Link}
                  to={navItemTo(entry, pathname)}
                  selected={selected}
                  onClick={handleNavClick}
                  sx={itemSx}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Icon sx={{ fontSize: NAV_ICON_SIZE }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        component="span"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <span>{entry.itemLabel}</span>
                        {badge > 0 ? (
                          <Badge
                            badgeContent={Math.min(badge, 99)}
                            color="error"
                            sx={{
                              "& .MuiBadge-badge": {
                                fontSize: "0.65rem",
                                minWidth: 18,
                                height: 18,
                                fontWeight: 700,
                                position: "static",
                                transform: "none",
                              },
                            }}
                          />
                        ) : null}
                      </Box>
                    }
                    secondary={entry.sectionTitle}
                    primaryTypographyProps={{
                      fontSize: NAV_LABEL_FONT,
                      fontWeight: selected ? 600 : 500,
                      lineHeight: 1.35,
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.7rem",
                      lineHeight: 1.3,
                    }}
                  />
                </ListItemButton>
              );
            })
          )}
        </List>
      ) : (
        <List disablePadding sx={{ px: 0.5 }}>
          {visibleSections.map((section) => {
            const isOpen = Boolean(openSections[section.id]);
            const hasActiveChild = section.items.some((item) =>
              isPathActive(pathname, item.path)
            );

            return (
              <Box key={section.id} sx={{ mb: 0.375 }}>
                <ListItemButton
                  onClick={() => toggleSection(section.id)}
                  sx={{
                    ...headerSx,
                    bgcolor: hasActiveChild
                      ? alpha(brandPrimary, 0.06)
                      : "transparent",
                  }}
                >
                  <ListItemText
                    primary={t(section.titleKey)}
                    primaryTypographyProps={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: hasActiveChild ? brandPrimary : "text.secondary",
                    }}
                  />
                  <ExpandMoreIcon
                    sx={{
                      fontSize: 18,
                      color: "text.secondary",
                      transition: transition("transform"),
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </ListItemButton>

                <Collapse
                  in={isOpen}
                  timeout={{ enter: DURATION.normal, exit: DURATION.fast }}
                  easing={{ enter: EASE_SOFT, exit: EASE_SOFT }}
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const selected = isPathActive(pathname, item.path);
                      const badge = navBadgeCount(item, badgeCounts);
                      return (
                        <ListItemButton
                          key={item.path}
                          component={Link}
                          to={navItemTo(item, pathname)}
                          selected={selected}
                          onClick={onNavigate}
                          sx={itemSx}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Icon sx={{ fontSize: NAV_ICON_SIZE }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 1,
                                }}
                              >
                                <span>{t(item.labelKey)}</span>
                                {badge > 0 ? (
                                  <Badge
                                    badgeContent={Math.min(badge, 99)}
                                    color="error"
                                    aria-label={t("nav.unreadAlerts", {
                                      count: badge,
                                      defaultValue: `${badge} unread alerts`,
                                    })}
                                    sx={{
                                      "& .MuiBadge-badge": {
                                        fontSize: "0.65rem",
                                        minWidth: 18,
                                        height: 18,
                                        fontWeight: 700,
                                        position: "static",
                                        transform: "none",
                                      },
                                    }}
                                  />
                                ) : null}
                              </Box>
                            }
                            primaryTypographyProps={{
                              fontSize: NAV_LABEL_FONT,
                              fontWeight: selected ? 600 : 500,
                              lineHeight: 1.35,
                              component: "div",
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </List>
      )}
    </Box>
  );
}
