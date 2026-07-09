import { useRef } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "@/context/LanguageContext";
import { BRAND_PRIMARY } from "@/theme";
import { isUploadField } from "@/components/common/form/formLayout";
import { toast } from "@/utils/toast";

function partitionUploadFields(fields) {
  const singles = [];
  const groupMap = new Map();

  for (const f of fields) {
    if (!isUploadField(f)) continue;
    if (f.gridSize === 12 || !f.uploadGroup) {
      singles.push(f);
      continue;
    }
    const key = f.uploadGroup;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        key,
        title: f.uploadGroupTitle || key,
        variant: f.uploadGroupVariant || "default",
        fields: [],
      });
    }
    groupMap.get(key).fields.push(f);
  }

  return { singles, groups: [...groupMap.values()] };
}

function galleryField(field, { hideLabel = false } = {}) {
  return {
    ...field,
    label: hideLabel ? undefined : field.label,
    uploadCompact: false,
    fullWidthUpload: true,
    uploadVariant: "documentCard",
    uploadGallerySlot: true,
    documentCardPreset: "detailWide",
  };
}

function reportSlotGridSize(count) {
  if (count <= 2) return { xs: 6, sm: 6 };
  if (count <= 4) return { xs: 6, sm: 6, md: 3 };
  return { xs: 6, sm: 4, md: 3, lg: 2.4 };
}

function isSlotOccupied(field, formValues = {}, existingRow) {
  if (formValues[field.name] instanceof File) return true;
  const previewKey = field.previewKey || field.name;
  return Boolean(existingRow?.[previewKey]);
}

function ReportPhotoGroup({
  group,
  renderField,
  formValues,
  existingRow,
  onBulkSlotFiles,
}) {
  const { t } = useTranslation();
  const bulkInputRef = useRef(null);
  const count = group.fields.length;
  const slotProps = reportSlotGridSize(count);
  const bulkEnabled = group.fields.some((f) => f.uploadBulkMultiple);
  const emptySlots = bulkEnabled
    ? group.fields.filter((f) => !isSlotOccupied(f, formValues, existingRow)).length
    : 0;
  const gallerySlot = true;

  const handleBulkFiles = (fileList) => {
    if (!onBulkSlotFiles) return;
    const result = onBulkSlotFiles(group.fields, fileList);
    if (result?.noImages) {
      toast.warning(
        t("fields.uploadBulkNoImages", {
          defaultValue: "Please choose image files.",
        }),
      );
      return;
    }
    if (result?.added > 0) {
      toast.success(
        t("fields.uploadBulkAdded", {
          defaultValue: "{{count}} photo(s) added.",
          count: result.added,
        }),
      );
    }
    if (result?.skipped > 0) {
      toast.warning(
        t("fields.uploadBulkSkipped", {
          defaultValue:
            "Only {{max}} photos allowed — {{count}} extra photo(s) skipped.",
          max: count,
          count: result.skipped,
        }),
      );
    }
    if (result?.added === 0 && result?.skipped === 0) {
      toast.warning(
        t("fields.uploadBulkFull", {
          defaultValue: "All photo slots are already filled.",
        }),
      );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: (theme) =>
          alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.03 : 0.08),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: alpha(BRAND_PRIMARY, 0.12),
            color: BRAND_PRIMARY,
            flexShrink: 0,
          }}
        >
          <ImageOutlinedIcon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
            {group.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {bulkEnabled
              ? t("fields.uploadGalleryBulkHint", {
                  defaultValue:
                    "Choose multiple photos at once or tap a slot to add or replace.",
                })
              : t("fields.uploadGalleryHint", {
                  defaultValue: "Tap a slot to add or replace an image.",
                })}
          </Typography>
        </Box>
      </Box>

      {bulkEnabled ? (
        <Button
          type="button"
          variant="outlined"
          color="primary"
          startIcon={<CollectionsOutlinedIcon />}
          onClick={() => bulkInputRef.current?.click()}
          disabled={emptySlots === 0}
          sx={{
            mb: 2,
            justifyContent: "flex-start",
            textAlign: "left",
            py: 1.25,
            px: 2,
            borderRadius: 2,
            borderStyle: "dashed",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} display="block">
              {t("fields.uploadBulkChoose", {
                defaultValue: "Choose multiple photos",
              })}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {emptySlots > 0
                ? t("fields.uploadBulkSlotsOpen", {
                    defaultValue: "{{count}} empty slot(s) available",
                    count: emptySlots,
                  })
                : t("fields.uploadBulkFull", {
                    defaultValue: "All photo slots are already filled.",
                  })}
            </Typography>
          </Box>
        </Button>
      ) : null}

      <Grid container spacing={gallerySlot ? 1.75 : 2}>
        {group.fields.map((f, index) => (
          <Grid item {...slotProps} key={f.name}>
            <Box
              sx={{
                position: "relative",
                p: gallerySlot ? 1.25 : 0,
                borderRadius: 2.5,
                bgcolor: gallerySlot ? "background.paper" : "transparent",
                border: gallerySlot ? 1 : 0,
                borderColor: gallerySlot ? "divider" : "transparent",
                boxShadow: gallerySlot
                  ? (theme) =>
                      `0 1px 4px ${alpha(theme.palette.common.black, theme.palette.mode === "light" ? 0.05 : 0.18)}`
                  : "none",
              }}
            >
              {gallerySlot ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 2,
                    minWidth: 22,
                    height: 22,
                    px: 0.75,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92),
                    color: "primary.main",
                    border: 1,
                    borderColor: (theme) => alpha(BRAND_PRIMARY, 0.22),
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="caption" fontWeight={800} lineHeight={1}>
                    {index + 1}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{
                    mb: 0.75,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontSize: "0.65rem",
                    display: "block",
                  }}
                >
                  {f.label || `#${index + 1}`}
                </Typography>
              )}
              {renderField(galleryField(f, { hideLabel: true }))}
            </Box>
          </Grid>
        ))}
      </Grid>

      {bulkEnabled ? (
        <input
          ref={bulkInputRef}
          type="file"
          accept={group.fields[0]?.accept || "image/*"}
          multiple
          hidden
          onChange={(e) => {
            handleBulkFiles(e.target.files);
            e.target.value = "";
          }}
        />
      ) : null}
    </Paper>
  );
}

function DefaultPhotoGroup({ group, renderField }) {
  return (
    <Grid
      item
      xs={12}
      sm={group.fields.length > 3 ? 12 : 6}
      lg={group.fields.length > 3 ? 12 : 4}
      key={group.key}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          p: { xs: 1.5, sm: 2 },
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          color="primary.main"
          sx={{ mb: 1.5 }}
        >
          {group.title}
        </Typography>
        <Grid container spacing={1.5}>
          {group.fields.map((f) => (
            <Grid item xs={6} sm={group.fields.length > 4 ? 4 : 6} key={f.name}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                display="block"
                sx={{ mb: 0.75 }}
              >
                {f.label}
              </Typography>
              {renderField(galleryField(f))}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Grid>
  );
}

export default function UploadDocumentGallery({
  fields = [],
  renderField,
  formValues,
  existingRow,
  onBulkSlotFiles,
}) {
  const { singles, groups } = partitionUploadFields(fields);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {singles.map((f) => (
        <Paper
          key={f.name}
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: (theme) =>
              alpha(
                BRAND_PRIMARY,
                theme.palette.mode === "light" ? 0.02 : 0.06,
              ),
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color="primary.main"
            sx={{ mb: 1.5 }}
          >
            {f.uploadGroupTitle || f.label}
          </Typography>
          {renderField(galleryField(f))}
        </Paper>
      ))}

      {groups.map((group) =>
        group.variant === "report" ? (
          <ReportPhotoGroup
            key={group.key}
            group={group}
            renderField={renderField}
            formValues={formValues}
            existingRow={existingRow}
            onBulkSlotFiles={onBulkSlotFiles}
          />
        ) : (
          <Grid container spacing={2} key={group.key}>
            <DefaultPhotoGroup group={group} renderField={renderField} />
          </Grid>
        ),
      )}
    </Box>
  );
}

export function mergeFilesIntoSlots(fields, formValues = {}, existingRow, fileList) {
  const images = Array.from(fileList || []).filter((file) =>
    file.type.startsWith("image/"),
  );
  if (!images.length) {
    return { updates: {}, added: 0, skipped: 0, noImages: true };
  }

  const emptyFields = fields.filter(
    (field) => !isSlotOccupied(field, formValues, existingRow),
  );
  const updates = {};
  let added = 0;
  let skipped = 0;

  for (let i = 0; i < images.length; i += 1) {
    if (i >= emptyFields.length) {
      skipped = images.length - i;
      break;
    }
    updates[emptyFields[i].name] = images[i];
    added += 1;
  }

  return { updates, added, skipped, noImages: false };
}

export function shouldUseUploadGallery(fields = []) {
  const uploads = fields.filter(isUploadField);
  if (uploads.length < 2) return false;
  return uploads.some((f) => f.uploadGroup);
}
