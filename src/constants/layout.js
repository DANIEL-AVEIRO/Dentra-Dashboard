/**
 * Comfortable layout spacing — readable, not cramped.
 */

export const DRAWER_WIDTH = 260;
export const DRAWER_WIDTH_MOBILE = "min(260px, 88vw)";
export const APP_BAR_HEIGHT = 64;
export const PAGE_PADDING = { xs: 1.25, sm: 2, md: 2.5 };
export const SECTION_GAP = 2;
/** Vertical rhythm between page sections (banner, cards, tables) */
export const PAGE_SHELL_GAP = { xs: 1.5, sm: 2, md: 2 };
export const STACK_GAP = 2;
export const FORM_GAP = 2;
export const DIALOG_GAP = 2;
export const GRID_SPACING = 1.5;
export const TABLE_MAX_HEIGHT = "calc(100vh - 280px)";
export const TABLE_MAX_HEIGHT_MOBILE = "calc(100dvh - 220px)";

/** Tables, filter bars & bulk bars — same subtle corners */
export const TABLE_BORDER_RADIUS = 2;

/** @deprecated Use TABLE_BORDER_RADIUS */
export const TABLE_FILTER_BORDER_RADIUS = TABLE_BORDER_RADIUS;

/** Unified height for search, date pickers, selects, export buttons in table toolbars */
export const TABLE_FILTER_HEIGHT = 40;
export const TABLE_FILTER_CELL_MIN = 148;
export const TABLE_FILTER_CELL_MAX = 176;
export const TABLE_FILTER_DATE_WIDTH = { xs: "100%", md: 158 };
export const TABLE_FILTER_SELECT_WIDTH = { xs: "100%", md: TABLE_FILTER_CELL_MAX };
export const TABLE_FILTER_SEARCH_MIN = { xs: 0, md: 200 };
export const TABLE_FILTER_SEARCH_MAX = { xs: "100%", md: 240 };
export const TABLE_FILTER_SEARCH_WIDTH = 240;

/** Responsive columns — auto-fill with fixed max width (no stretch on wide screens). */
export const TABLE_FILTER_GRID_COLUMNS = {
  xs: "minmax(0, 1fr)",
  md: `repeat(auto-fill, minmax(${TABLE_FILTER_CELL_MIN}px, ${TABLE_FILTER_CELL_MAX}px))`,
};

/** Each select cell inside TableFilterSelectGrid */
export const TABLE_FILTER_FIELD_SX = {
  width: "100%",
  minWidth: 0,
};

export const TABLE_FILTER_SELECT_SX = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    minHeight: TABLE_FILTER_HEIGHT,
    height: TABLE_FILTER_HEIGHT,
  },
};

/** Sidebar / nav */
export const NAV_ITEM_MIN_HEIGHT = 44;
export const NAV_SECTION_MIN_HEIGHT = 40;
export const NAV_ICON_SIZE = 22;
export const NAV_LABEL_FONT = "0.875rem";
