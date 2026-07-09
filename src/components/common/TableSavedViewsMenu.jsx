import { useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useTranslation } from "@/context/LanguageContext";
import { TABLE_FILTER_HEIGHT } from "@/constants/layout";

export default function TableSavedViewsMenu({
  views,
  onSave,
  onApply,
  onDelete,
  disabled = false,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const [anchor, setAnchor] = useState(null);
  const [name, setName] = useState("");
  const open = Boolean(anchor);

  return (
    <>
      <Tooltip title={t("table.savedViews")}>
        <span>
          <IconButton
            size="small"
            disabled={disabled}
            onClick={(e) => setAnchor(e.currentTarget)}
            aria-label={t("table.savedViews")}
            sx={{
              width: TABLE_FILTER_HEIGHT,
              height: TABLE_FILTER_HEIGHT,
              border: 1,
              borderColor: "divider",
              color: primary,
            }}
          >
            <BookmarkBorderIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </span>
      </Tooltip>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        <Box sx={{ px: 2, py: 1.25, width: 260 }}>
          <TextField
            size="small"
            fullWidth
            placeholder={t("table.savedViewName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <MenuItem
            disabled={!name.trim()}
            onClick={() => {
              onSave?.(name.trim());
              setName("");
              setAnchor(null);
            }}
            sx={{ mt: 0.5, borderRadius: 1 }}
          >
            <ListItemIcon>
              <SaveOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("table.saveView")}</ListItemText>
          </MenuItem>
        </Box>
        {views.map((view) => (
          <MenuItem
            key={view.name}
            onClick={() => {
              onApply?.(view);
              setAnchor(null);
            }}
          >
            <ListItemText primary={view.name} />
            <IconButton
              size="small"
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(view.name);
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
