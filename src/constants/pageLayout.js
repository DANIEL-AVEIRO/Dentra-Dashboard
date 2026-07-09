import { alpha } from "@mui/material/styles";
import { PAGE_SHELL_GAP, TABLE_BORDER_RADIUS } from "@/constants/layout";

export { PAGE_SHELL_GAP };

/** Default max width for dense admin forms; tables stay full width */
export const PAGE_SHELL_MAX_WIDTH = 1440;

export const pageStackSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: PAGE_SHELL_GAP,
  minWidth: 0,
};

export const pageShellSx = {
  maxWidth: PAGE_SHELL_MAX_WIDTH,
  mx: "auto",
  ...pageStackSx,
};

/** Page top banner — title, subtitle, actions (GJM-style) */
export const pageToolbarPaperSx = {
  borderRadius: TABLE_BORDER_RADIUS,
  border: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
  overflow: "hidden",
};

export const pageSectionPaperSx = {
  borderRadius: TABLE_BORDER_RADIUS,
  border: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
  overflow: "hidden",
};

export const filterZoneSx = (theme) => {
  const primary = theme.palette.primary.main;
  return {
    px: { xs: 1.5, sm: 2 },
    py: { xs: 1.5, sm: 2 },
    borderBottom: 1,
    borderColor: "divider",
    bgcolor:
      theme.palette.mode === "light"
        ? alpha(primary, 0.03)
        : alpha(primary, 0.06),
  };
};

export const pageSectionHeaderSx = {
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1, sm: 1.25 },
  borderBottom: 1,
  borderColor: "divider",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 1,
};
