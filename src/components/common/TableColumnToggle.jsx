import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  Popover,
  Switch,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { useTranslation } from "@/context/LanguageContext";
import { TABLE_FILTER_HEIGHT } from "@/constants/layout";
import { transition } from "@/constants/motion";

export default function TableColumnToggle({
  columns,
  visibleColumnKeys,
  onToggle,
  onReset,
  onReorderColumn,
  disabled = false,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const [anchor, setAnchor] = useState(null);
  const [dragKey, setDragKey] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);
  const open = Boolean(anchor);

  const totalCount = columns?.length ?? 0;
  const visibleCount = useMemo(() => {
    if (!columns?.length) return 0;
    return columns.filter((col) => visibleColumnKeys.has(col.key)).length;
  }, [columns, visibleColumnKeys]);

  const allVisible = totalCount > 0 && visibleCount === totalCount;

  if (!columns?.length) return null;

  const handleShowAll = () => {
    columns.forEach((col) => {
      if (!visibleColumnKeys.has(col.key)) onToggle(col.key);
    });
  };

  const handleRowToggle = (key) => {
    const isVisible = visibleColumnKeys.has(key);
    if (isVisible && visibleColumnKeys.size <= 1) return;
    onToggle(key);
  };

  return (
    <>
      <Tooltip title={t("table.columnsToggle")}>
        <span>
          <IconButton
            size="small"
            disabled={disabled}
            onClick={(e) => setAnchor(e.currentTarget)}
            aria-label={t("table.columnsToggle")}
            aria-expanded={open}
            sx={{
              width: TABLE_FILTER_HEIGHT,
              height: TABLE_FILTER_HEIGHT,
              flexShrink: 0,
              border: 1,
              borderColor: open ? alpha(primary, 0.45) : "divider",
              color: primary,
              bgcolor: open ? alpha(primary, 0.1) : "transparent",
              transition: transition("background-color, border-color"),
              "&:hover": {
                bgcolor: alpha(primary, 0.12),
                borderColor: alpha(primary, 0.35),
              },
            }}
          >
            <ViewColumnOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </span>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 0.75,
              width: { xs: "min(92vw, 320px)", sm: 320 },
              borderRadius: 2.5,
              border: 1,
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 12px 40px rgba(15, 23, 42, 0.12)"
                  : "0 16px 48px rgba(0, 0, 0, 0.45)",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor:
              theme.palette.mode === "light"
                ? alpha(primary, 0.04)
                : alpha(primary, 0.1),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
            <Box
              sx={{
                mt: 0.15,
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                bgcolor: alpha(primary, 0.12),
                color: primary,
              }}
            >
              <ViewColumnOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={800} lineHeight={1.3}>
                {t("table.columnsShow")}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.35 }}>
                {t("table.columnsHint")}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mt: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Chip
              size="small"
              label={t("table.columnsVisible", {
                visible: visibleCount,
                total: totalCount,
              })}
              sx={{
                fontWeight: 700,
                bgcolor: allVisible ? alpha(primary, 0.12) : "background.paper",
                color: allVisible ? primary : "text.secondary",
                border: 1,
                borderColor: allVisible ? alpha(primary, 0.28) : "divider",
              }}
            />
            <Tooltip title={t("table.columnsShowAll")}>
              <span>
                <IconButton
                  size="small"
                  disabled={allVisible}
                  onClick={handleShowAll}
                  aria-label={t("table.columnsShowAll")}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 999,
                    px: 1.25,
                    gap: 0.5,
                    color: allVisible ? "text.disabled" : primary,
                    bgcolor: allVisible ? "action.hover" : alpha(primary, 0.08),
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    "&:hover": {
                      bgcolor: allVisible ? "action.hover" : alpha(primary, 0.14),
                    },
                  }}
                >
                  <DoneAllOutlinedIcon sx={{ fontSize: 17 }} />
                  <Typography component="span" variant="caption" fontWeight={700}>
                    {t("table.columnsShowAll")}
                  </Typography>
                </IconButton>
              </span>
            </Tooltip>
            {onReset ? (
              <Tooltip title={t("table.columnsReset")}>
                <span>
                  <IconButton
                    size="small"
                    onClick={onReset}
                    aria-label={t("table.columnsReset")}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 999,
                      color: "text.secondary",
                    }}
                  >
                    <RestartAltOutlinedIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}
          </Box>
        </Box>

        <Box
          role="list"
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            px: 1,
            py: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.35,
          }}
        >
          {columns.map((col) => {
            const checked = visibleColumnKeys.has(col.key);
            const locked = checked && visibleColumnKeys.size <= 1;
            const isDragging = dragKey === col.key;
            const isDragOver = dragOverKey === col.key && dragKey !== col.key;
            return (
              <Box
                key={col.key}
                role="listitem"
                onClick={() => !locked && handleRowToggle(col.key)}
                onDragOver={(e) => {
                  if (!onReorderColumn || !dragKey) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragKey !== col.key) setDragOverKey(col.key);
                }}
                onDragLeave={() => {
                  if (dragOverKey === col.key) setDragOverKey(null);
                }}
                onDrop={(e) => {
                  if (!onReorderColumn) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const activeKey = dragKey || e.dataTransfer.getData("text/plain");
                  if (activeKey && activeKey !== col.key) {
                    onReorderColumn(activeKey, col.key);
                  }
                  setDragKey(null);
                  setDragOverKey(null);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  px: 1.25,
                  py: 0.65,
                  borderRadius: 1.5,
                  cursor: locked ? "not-allowed" : "pointer",
                  opacity: isDragging ? 0.45 : checked ? 1 : 0.72,
                  bgcolor: isDragOver
                    ? alpha(primary, 0.14)
                    : checked
                      ? alpha(primary, 0.06)
                      : "transparent",
                  border: 1,
                  borderColor: isDragOver
                    ? alpha(primary, 0.4)
                    : checked
                      ? alpha(primary, 0.16)
                      : "transparent",
                  transition: transition("background-color, border-color, opacity"),
                  "&:hover": locked
                    ? {}
                    : {
                        bgcolor: isDragOver
                          ? alpha(primary, 0.14)
                          : checked
                            ? alpha(primary, 0.1)
                            : "action.hover",
                        borderColor: isDragOver
                          ? alpha(primary, 0.4)
                          : checked
                            ? alpha(primary, 0.22)
                            : "divider",
                        opacity: isDragging ? 0.45 : 1,
                      },
                }}
              >
                {onReorderColumn ? (
                  <Box
                    draggable
                    onDragStart={(e) => {
                      setDragKey(col.key);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", col.key);
                    }}
                    onDragEnd={() => {
                      setDragKey(null);
                      setDragOverKey(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={t("table.dragColumn")}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexShrink: 0,
                      color: "text.disabled",
                      cursor: "grab",
                      touchAction: "none",
                      "&:active": { cursor: "grabbing" },
                    }}
                  >
                    <DragIndicatorIcon sx={{ fontSize: 18 }} />
                  </Box>
                ) : null}
                <Typography
                  variant="body2"
                  fontWeight={checked ? 700 : 500}
                  color={checked ? "text.primary" : "text.secondary"}
                  sx={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                </Typography>
                <Switch
                  size="small"
                  checked={checked}
                  disabled={locked}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleRowToggle(col.key)}
                  inputProps={{ "aria-label": col.label }}
                  sx={{
                    flexShrink: 0,
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: primary,
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      bgcolor: primary,
                      opacity: 0.55,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: theme.palette.mode === "light" ? "grey.50" : "action.hover",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {t("table.columnsMinOne")}
          </Typography>
        </Box>
      </Popover>
    </>
  );
}
