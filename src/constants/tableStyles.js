import { alpha, lighten } from "@mui/material/styles";
import { transition } from "@/constants/motion";

const brandPrimary = (theme) => theme.palette.primary.main;
const brandSecondary = (theme) => theme.palette.secondary.main;

/** Readable data tables — roomier cells and type */
export const TABLE_CELL_PY = 1.5;
export const TABLE_CELL_PX = 2;
export const TABLE_HEAD_PY = TABLE_CELL_PY;
export const TABLE_BODY_FONT_SIZE = "0.9375rem";
export const TABLE_HEAD_FONT_SIZE = TABLE_BODY_FONT_SIZE;
export const TABLE_CELL_MIN_WIDTH = 140;
export const TABLE_CHECKBOX_WIDTH = 32;
export const TABLE_ROW_INDEX_WIDTH = 40;

/** Shared class for TableCheckbox tile — used in hover selectors */
export const TABLE_CHECKBOX_VISUAL_CLASS = "table-checkbox-visual";

/** Centered checkbox column — width: 1% keeps the column content-sized */
export function tableCheckboxCellSx(extra = {}) {
  return {
    width: "1%",
    minWidth: TABLE_CHECKBOX_WIDTH,
    maxWidth: TABLE_CHECKBOX_WIDTH,
    px: 0.25,
    py: { xs: 1, sm: TABLE_CELL_PY },
    textAlign: "center",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    ...extra,
  };
}

/** Row number (#) column — width: 1% keeps the column content-sized (like checkbox) */
export function tableRowIndexCellSx(extra = {}) {
  return {
    width: "1%",
    minWidth: TABLE_ROW_INDEX_WIDTH,
    maxWidth: TABLE_ROW_INDEX_WIDTH,
    px: 0.5,
    py: { xs: 1, sm: TABLE_CELL_PY },
    textAlign: "center",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    ...extra,
  };
}

/** Table row selection control — generous hit area, hover ring on idle tile */
export function tableCheckboxSx(theme) {
  const isLight = theme.palette.mode === "light";
  const primary = brandPrimary(theme);
  const visual = TABLE_CHECKBOX_VISUAL_CLASS;

  return {
    p: 0.25,
    m: 0,
    borderRadius: 2,
    transition: transition("background-color", 160),
    "&:hover:not(.Mui-disabled)": {
      bgcolor: alpha(primary, isLight ? 0.07 : 0.14),
    },
    [`&:hover:not(.Mui-disabled) .${visual}:not(.${visual}--active)`]: {
      borderColor: alpha(primary, isLight ? 0.55 : 0.72),
      bgcolor: alpha(primary, isLight ? 0.05 : 0.12),
      boxShadow: `0 0 0 3px ${alpha(primary, isLight ? 0.1 : 0.18)}`,
    },
    "&.Mui-checked:hover:not(.Mui-disabled), &.MuiCheckbox-indeterminate:hover:not(.Mui-disabled)":
      {
        bgcolor: alpha(primary, isLight ? 0.1 : 0.18),
      },
    [`&:hover:not(.Mui-disabled) .${visual}--active`]: {
      boxShadow: `0 2px 8px ${alpha(primary, 0.35)}`,
    },
    "&.Mui-disabled": {
      opacity: 1,
    },
    [`&.Mui-disabled .${visual}`]: {
      opacity: 0.42,
    },
    "&.Mui-disabled:hover": {
      bgcolor: "transparent",
    },
    "&:focus-visible": {
      outline: `2px solid ${alpha(primary, 0.45)}`,
      outlineOffset: 2,
    },
  };
}

/** Row action icon tile (TableActionButton) */
export const TABLE_ACTION_SIZE = 32;
/** Space between action icons (theme spacing units → 6px at 0.75) */
export const TABLE_ACTION_GAP = 0.75;
/** Min width for ~5 action icons in one row without overlap */
export const TABLE_ACTIONS_MIN_WIDTH =
  TABLE_ACTION_SIZE * 5 + Math.round(TABLE_ACTION_GAP * 8) * 4;
export const TABLE_ACTIONS_WIDTH = TABLE_ACTIONS_MIN_WIDTH;

/** Opaque tint — alpha breaks sticky headers (rows show through on scroll). */
export function tableHeaderBg(theme) {
  return theme.palette.mode === "light"
    ? lighten(theme.palette.primary.main, 0.9)
    : lighten(theme.palette.background.paper, 0.08);
}

export function tableHeadBorder(theme) {
  const primary = brandPrimary(theme);
  return `1px solid ${alpha(primary, theme.palette.mode === "light" ? 0.1 : 0.18)}`;
}

export function tableHeadCellSx(theme, headerBg = tableHeaderBg(theme)) {
  return {
    bgcolor: headerBg,
    backgroundImage: "none",
    borderBottom: tableHeadBorder(theme),
    fontWeight: 400,
    fontSize: TABLE_BODY_FONT_SIZE,
    color: "text.primary",
    whiteSpace: "nowrap",
    py: { xs: 1, sm: TABLE_HEAD_PY },
    px: { xs: 1.25, sm: TABLE_CELL_PX },
    lineHeight: 1.5,
    verticalAlign: "middle",
    minWidth: { xs: 96, sm: TABLE_CELL_MIN_WIDTH },
    "& .MuiTableSortLabel-root": {
      alignItems: "center",
      whiteSpace: "nowrap",
      lineHeight: 1.5,
      fontWeight: 400,
      fontSize: TABLE_BODY_FONT_SIZE,
      color: "inherit",
      cursor: "pointer",
      userSelect: "none",
    },
    "& .MuiTableSortLabel-root.Mui-active": {
      fontWeight: 400,
      color: "inherit",
    },
    "& .MuiTableSortLabel-icon": {
      flexShrink: 0,
    },
  };
}

export function tableBodyCellSx(col = {}) {
  const truncate = col.truncate === true;
  return {
    py: { xs: 1, sm: TABLE_CELL_PY },
    px: { xs: 1.25, sm: TABLE_CELL_PX },
    fontSize: TABLE_BODY_FONT_SIZE,
    lineHeight: 1.5,
    borderColor: "divider",
    verticalAlign: "middle",
    whiteSpace: col.wrap ? "normal" : "nowrap",
    overflow: truncate ? "hidden" : "visible",
    textOverflow: truncate ? "ellipsis" : "clip",
    minWidth: col.minWidth ?? { xs: 96, sm: TABLE_CELL_MIN_WIDTH },
    maxWidth: col.maxWidth,
    width: col.width,
  };
}

/** Plain text in cells — full value visible; table scrolls on x when wide */
export function tableCellInnerSx(truncate = false) {
  if (truncate) {
    return {
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "100%",
    };
  }
  return {
    display: "inline-block",
    whiteSpace: "nowrap",
  };
}

/** Action column body cell — no opaque bg unless sticky (so row hover shows through). */
export function tableActionCellSx(theme, { sticky = false, compactSx = {} } = {}) {
  const isLight = theme.palette.mode === "light";
  const primary = brandPrimary(theme);

  const base = {
    ...tableBodyCellSx(),
    ...compactSx,
    py: 0.5,
    px: 0.75,
    width: TABLE_ACTIONS_WIDTH,
    minWidth: TABLE_ACTIONS_MIN_WIDTH,
    whiteSpace: "nowrap",
  };

  if (!sticky) return base;

  const stickyShadow =
    theme.palette.mode === "light" ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.25)";

  return {
    ...base,
    position: "sticky",
    right: 0,
    zIndex: 2,
    boxShadow: `-4px 0 8px ${stickyShadow}`,
    bgcolor: "background.paper",
    ".MuiTableRow-root:nth-of-type(even) &": {
      bgcolor: alpha(primary, isLight ? 0.015 : 0.04),
    },
    ".MuiTableRow-root:hover &": {
      bgcolor: alpha(primary, 0.05),
    },
    ".MuiTableRow-root:nth-of-type(even):hover &": {
      bgcolor: alpha(primary, 0.06),
    },
    ".MuiTableRow-root.Mui-selected &": {
      bgcolor: alpha(primary, isLight ? 0.07 : 0.12),
    },
    ".MuiTableRow-root.Mui-selected:hover &": {
      bgcolor: alpha(primary, isLight ? 0.09 : 0.15),
    },
  };
}

export function tableRowSx(theme) {
  const isLight = theme.palette.mode === "light";
  const primary = brandPrimary(theme);

  return {
    "&:last-child td": { borderBottom: 0 },
    "&:hover": {
      bgcolor: alpha(primary, 0.05),
    },
    "&.Mui-selected": {
      bgcolor: alpha(primary, isLight ? 0.07 : 0.12),
      boxShadow: `inset 3px 0 0 ${primary}`,
      "&:hover": {
        bgcolor: alpha(primary, isLight ? 0.09 : 0.15),
      },
    },
    "&:nth-of-type(even)": {
      bgcolor: alpha(
        theme.palette.primary.main,
        theme.palette.mode === "light" ? 0.015 : 0.04
      ),
    },
    "&:nth-of-type(even):hover": {
      bgcolor: alpha(primary, 0.06),
    },
  };
}

export function tablePaperSx() {
  return {
    width: "100%",
    overflow: "visible",
    bgcolor: "background.paper",
  };
}

/** Shared table + container sizing — horizontal scroll, full cell text */
export const tableDataSx = {
  width: "max-content",
  minWidth: "100%",
  tableLayout: "auto",
};

export function tableContainerScrollSx(theme, maxHeight) {
  return {
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    position: "relative",
    overflowX: "auto",
    overflowY: "auto",
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
    ...(maxHeight != null ? { maxHeight } : {}),
    ...tableScrollSx(theme),
  };
}

/** Thin pill scrollbars for table overflow (x + y) */
export function tableScrollSx(theme) {
  const isLight = theme.palette.mode === "light";
  const base = isLight ? brandPrimary(theme) : brandSecondary(theme);
  const thumb = alpha(base, isLight ? 0.32 : 0.45);
  const thumbHover = alpha(base, isLight ? 0.5 : 0.65);
  const thumbActive = alpha(base, isLight ? 0.62 : 0.78);

  return {
    scrollbarWidth: "thin",
    scrollbarColor: `${thumb} transparent`,
    "&::-webkit-scrollbar": {
      width: 8,
      height: 8,
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: thumb,
      borderRadius: 999,
      border: "2px solid transparent",
      backgroundClip: "padding-box",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: thumbHover,
    },
    "&::-webkit-scrollbar-thumb:active": {
      backgroundColor: thumbActive,
    },
    "&::-webkit-scrollbar-corner": {
      background: "transparent",
    },
  };
}

/** Scrollable area without visible scrollbar (wheel/touch still works). */
export function hideScrollbarSx() {
  return {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
      width: 0,
      height: 0,
    },
  };
}
