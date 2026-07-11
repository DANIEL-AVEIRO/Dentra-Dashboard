/** At least this many visible fields → two-column modal form */
export const DIALOG_FORM_TWO_COLUMN_MIN = 4;

export function isUploadField(field) {
  return field?.type === "file";
}

export function uploadGroupGridSizes(count) {
  if (count <= 0) return [];
  if (count === 1) return [12];
  if (count === 2) return [6, 6];
  if (count === 3) return [4, 4, 4];
  const sizes = [];
  let rem = count;
  while (rem > 0) {
    if (rem === 3) {
      sizes.push(4, 4, 4);
      break;
    }
    if (rem === 1) {
      sizes.push(12);
      break;
    }
    sizes.push(6, 6);
    rem -= 2;
  }
  return sizes;
}

export function computeFieldGridSizes(fields = []) {
  const sizes = [];
  let i = 0;
  while (i < fields.length) {
    const field = fields[i];
    if (field.gridSize != null) {
      sizes.push(field.gridSize);
      i += 1;
      continue;
    }
    if (isFormFieldFullWidth(field)) {
      sizes.push(12);
      i += 1;
      continue;
    }

    if (isUploadField(field)) {
      const section = field.section ?? null;
      const uploadGroup = field.uploadGroup ?? null;
      let count = 0;
      while (i + count < fields.length) {
        const f = fields[i + count];
        if (!isUploadField(f) || (f.section ?? null) !== section) break;
        if (isFormFieldFullWidth(f)) break;
        const fGroup = f.uploadGroup ?? null;
        if (uploadGroup !== fGroup) break;
        count += 1;
      }
      sizes.push(...uploadGroupGridSizes(count));
      i += count;
      continue;
    }

    const next = fields[i + 1];
    const sameSection = (field.section ?? null) === (next?.section ?? null);
    const canPair =
      next &&
      !isFormFieldFullWidth(next) &&
      !isUploadField(next) &&
      sameSection;
    if (canPair) {
      sizes.push(6, 6);
      i += 2;
    } else {
      sizes.push(12);
      i += 1;
    }
  }
  return sizes;
}

import { FORM_GAP } from "@/constants/layout";

/** Vertical / horizontal rhythm for field grids */
export const FORM_FIELD_GAP = FORM_GAP;

/** 12-column responsive form grid (page / wide panels) */
export const formFieldGrid12Sx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(12, minmax(0, 1fr))",
  },
  gap: FORM_FIELD_GAP,
  columnGap: 2.5,
  alignItems: "start",
  width: "100%",
};

export const formFieldCellSx = {
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
};

/** Grid column span helper — full width on xs, `span N` on md+ */
export function formFieldColSpan(span) {
  return {
    gridColumn: { xs: "1 / -1", md: `span ${span}` },
    ...formFieldCellSx,
  };
}

/** Short numeric fields (weight, pieces) — two equal columns, full row width */
export const formCompactMetricsRowSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
  },
  gap: FORM_FIELD_GAP,
  columnGap: 2.5,
  width: "100%",
  alignItems: "start",
};

/** MMK charge fields — three equal columns; total COD spans full row below */
export const formChargeRowSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(3, minmax(0, 1fr))",
  },
  gap: FORM_FIELD_GAP,
  columnGap: 2.5,
  width: "100%",
  alignItems: "start",
};

/** Single-column stack (dialogs, narrow panels) */
export const formFieldStackSx = {
  display: "flex",
  flexDirection: "column",
  gap: FORM_FIELD_GAP,
  width: "100%",
};

/** Name (flex) + phone (fixed) on one row */
export const formContactRowSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "minmax(0, 1fr) minmax(160px, 220px)",
  },
  gap: FORM_FIELD_GAP,
  columnGap: 2.5,
  width: "100%",
  alignItems: "start",
};

/** Two equal columns — address/location, etc. */
export const formTwoColRowSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
  },
  gap: FORM_FIELD_GAP,
  columnGap: 2.5,
  width: "100%",
  alignItems: "start",
};

/** Full-width in 2-col grid — file uploads stay content-sized (GJM pattern) */
export function isFormFieldFullWidth(field) {
  if (field?.fullWidth === true) return true;
  if (field?.fullWidth === false) return false;
  const type = field?.type;
  if (
    type === "multiSelect" ||
    type === "permissionCheckboxes" ||
    type === "permissionMatrix"
  )
    return true;
  if (field?.datePresets) return true;
  if (field?.multiline) return true;
  return false;
}

/** Shared horizontal inset for create/edit dialog chrome (title, body, footer) */
export const FORM_DIALOG_PX = { xs: 1.5, sm: 2 };

export const formDialogTitleSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  py: { xs: 1.5, sm: 2 },
  px: FORM_DIALOG_PX,
  flexShrink: 0,
};

export const dialogFormContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
  px: FORM_DIALOG_PX,
  pt: { xs: 2, sm: 2 },
  pb: { xs: 2.5, sm: 2.5 },
  width: "100%",
  boxSizing: "border-box",
  scrollbarGutter: "stable",
  "& > *:not(.MuiGrid-root)": {
    width: "100%",
    maxWidth: "100%",
  },
  "& .MuiFormControl-root": {
    width: "100%",
    maxWidth: "100%",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  "& .MuiTextField-root": {
    marginTop: 0,
    marginBottom: 0,
  },
  "& .MuiAutocomplete-root": {
    width: "100%",
    maxWidth: "100%",
    marginTop: 0,
    marginBottom: 0,
  },
};

export const roleDialogFormContentSx = {
  ...dialogFormContentSx,
  gap: 0,
  pt: 0,
  px: FORM_DIALOG_PX,
  py: { xs: 2, sm: 2.5 },
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
};

export const roleDialogActionsSx = {
  px: FORM_DIALOG_PX,
  py: 2,
  pb: { xs: "calc(16px + env(safe-area-inset-bottom, 0px))", sm: 2 },
  gap: 1,
  borderTop: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
  flexDirection: { xs: "column-reverse", sm: "row" },
  alignItems: { xs: "stretch", sm: "center" },
  "& > .MuiButton-root": {
    width: { xs: "100%", sm: "auto" },
    m: 0,
  },
};

export const pageFormSx = {
  width: "100%",
  maxWidth: "100%",
};

export const formGridContainerSx = {
  width: "100%",
  margin: 0,
  "& .MuiFormControl-root": {
    width: "100%",
    maxWidth: "100%",
  },
};

export const dialogFormGridSx = {
  width: "100%",
  margin: 0,
  "& > .MuiGrid-item": {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  "& .MuiFormControl-root, & .MuiAutocomplete-root, & .MuiBox-root": {
    width: "100%",
    maxWidth: "100%",
  },
};
