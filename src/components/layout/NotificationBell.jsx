import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import client from "@/api/client";
import { useTranslation } from "@/context/LanguageContext";
import HeaderIconButton from "@/components/layout/HeaderIconButton";

export default function NotificationBell() {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = items.filter((n) => !n.read_at).length;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/notifications/", {
        params: { page_size: 20 },
      });
      const list = data.results ?? data;
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [load]);

  const openMenu = (e) => {
    setAnchor(e.currentTarget);
    load();
  };

  const markRead = async (notice) => {
    if (notice.read_at) return;
    try {
      await client.post(`/notifications/${notice.id}/mark-read/`);
      setItems((prev) =>
        prev.map((n) =>
          n.id === notice.id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
    } catch {
      /* ignore */
    }
  };

  const markAll = async () => {
    try {
      await client.post("/notifications/mark-all-read/");
      setItems((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })),
      );
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <HeaderIconButton
        title={t("header.notifications", { defaultValue: "Notifications" })}
        onClick={openMenu}
        aria-label={t("header.notifications", { defaultValue: "Notifications" })}
      >
        <Badge
          color="error"
          badgeContent={unreadCount}
          max={99}
          overlap="circular"
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
        </Badge>
      </HeaderIconButton>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxWidth: "90vw", mt: 0.75 } } }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={700}>
            {t("header.notifications", { defaultValue: "Notifications" })}
          </Typography>
          {unreadCount > 0 ? (
            <IconButton size="small" onClick={markAll} sx={{ borderRadius: 1 }}>
              <Typography variant="caption" color="primary">
                {t("header.markAllRead", { defaultValue: "Mark all read" })}
              </Typography>
            </IconButton>
          ) : null}
        </Box>
        <Divider />
        <List dense sx={{ maxHeight: 360, overflow: "auto", py: 0 }}>
          {loading && items.length === 0 ? (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t("common.loading")}
              </Typography>
            </Box>
          ) : null}
          {!loading && items.length === 0 ? (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t("header.noNotifications", { defaultValue: "No notifications" })}
              </Typography>
            </Box>
          ) : null}
          {items.map((n) => (
            <ListItemButton
              key={n.id}
              onClick={() => markRead(n)}
              sx={{
                alignItems: "flex-start",
                bgcolor: n.read_at ? "transparent" : "action.hover",
              }}
            >
              <ListItemText
                primary={n.title || n.type || "Notice"}
                secondary={n.body || n.message}
                primaryTypographyProps={{
                  fontWeight: n.read_at ? 500 : 700,
                  variant: "body2",
                }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItemButton>
          ))}
        </List>
      </Menu>
    </>
  );
}
