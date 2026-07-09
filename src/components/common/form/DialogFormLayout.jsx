import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { BRAND_PRIMARY } from "@/theme";
import {
  DIALOG_FORM_TWO_COLUMN_MIN,
  computeFieldGridSizes,
  dialogFormGridSx,
  isUploadField,
} from "@/components/common/form/formLayout";
import UploadDocumentGallery, {
  shouldUseUploadGallery,
} from "@/components/common/form/UploadDocumentGallery";

function renderFieldsBlock(
  fields,
  twoColumn,
  renderField,
  { formValues, existingRow, onBulkSlotFiles } = {},
) {
  if (shouldUseUploadGallery(fields)) {
    const dataFields = fields.filter((f) => !isUploadField(f));
    const uploadFields = fields.filter(isUploadField);
    return (
      <>
        {dataFields.length > 0 &&
          renderFieldsBlock(dataFields, twoColumn, renderField, {
            formValues,
            existingRow,
            onBulkSlotFiles,
          })}
        <UploadDocumentGallery
          fields={uploadFields}
          renderField={renderField}
          formValues={formValues}
          existingRow={existingRow}
          onBulkSlotFiles={onBulkSlotFiles}
        />
      </>
    );
  }

  if (!twoColumn) {
    return fields.map((f) => renderField(f));
  }

  const gridSizes = computeFieldGridSizes(fields);
  const nodes = [];
  let lastGroupTitle = null;

  fields.forEach((f, index) => {
    const groupTitle = f.uploadGroupTitle;
    if (groupTitle && groupTitle !== lastGroupTitle) {
      nodes.push(
        <Grid item xs={12} key={`${f.name}-upload-group`}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              mt: nodes.length > 0 ? 1 : 0,
              mb: 0.5,
              pb: 0.5,
              borderBottom: 1,
              borderColor: (t) =>
                alpha(BRAND_PRIMARY, t.palette.mode === "light" ? 0.1 : 0.18),
            }}
          >
            {groupTitle}
          </Typography>
        </Grid>,
      );
      lastGroupTitle = groupTitle;
    }

    nodes.push(
      <Grid item xs={12} sm={gridSizes[index] ?? 12} key={f.name}>
        {renderField(f)}
      </Grid>,
    );
  });

  return (
    <Grid container spacing={2} sx={dialogFormGridSx}>
      {nodes}
    </Grid>
  );
}

export default function DialogFormLayout({
  fields = [],
  renderField,
  formValues,
  existingRow,
  onBulkSlotFiles,
}) {
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down("sm"));
  const visible = fields.filter((f) => !f.hideInForm);
  const twoColumn = visible.length >= DIALOG_FORM_TWO_COLUMN_MIN && !phone;

  return (
    <>
      {renderFieldsBlock(visible, twoColumn, renderField, {
        formValues,
        existingRow,
        onBulkSlotFiles,
      })}
    </>
  );
}

export function resolveFormDialogMaxWidth(fieldCount, prop = "sm") {
  if (prop === "lg") return "lg";
  if (prop === "md") return "md";
  if (fieldCount >= 6) return "md";
  return prop || "sm";
}
