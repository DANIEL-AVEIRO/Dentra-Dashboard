import { alpha } from "@mui/material/styles";
import { transition } from "@/constants/motion";
import { TABLE_BORDER_RADIUS } from "@/constants/layout";

/** Single card wrapping filter toolbar + table */
export const tablePanelPaperSx = {
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
  borderRadius: TABLE_BORDER_RADIUS,
  border: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
  transition: transition("border-color"),
};

export const tablePanelToolbarSx = {
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1.5, sm: 1.75 },
  borderBottom: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
};

export const tablePanelBulkSx = (theme) => {
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";

  return {
    px: { xs: 1.5, sm: 2 },
    py: { xs: 1.25, sm: 1.5 },
    borderBottom: 1,
    borderColor: "divider",
    bgcolor: isDark ? alpha(accent, 0.1) : "grey.50",
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    boxShadow: `inset 3px 0 0 ${accent}`,
  };
};
