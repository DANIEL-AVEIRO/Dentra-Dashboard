import { useEffect, useId, useRef, useState } from "react";
import { Box, CircularProgress, IconButton, Typography, alpha, useTheme } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTranslation } from "@/context/LanguageContext";
import { brandFromTheme } from "@/utils/brandPalette";
import { FIELD_RADIUS } from "@/components/common/form/fieldStyles";
import { resizeImageFile } from "@/utils/resizeImage";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import PdfPreview from "@/components/common/PdfPreview";

const PREVIEW_MIN_HEIGHT = 140;
const PREVIEW_MAX_HEIGHT = 200;
const COMPACT_MIN_HEIGHT = 88;
const COMPACT_MAX_HEIGHT = 120;
const DOCUMENT_CARD_MIN_HEIGHT = 120;
const DOCUMENT_CARD_MAX_HEIGHT = 168;
const DOCUMENT_CARD_DETAIL_MIN = 200;
const AVATAR_SIZE = 96;
const AVATAR_SIZE_LARGE = 120;
const LOGO_MIN_HEIGHT = 96;
const LOGO_MAX_HEIGHT = 120;
const LOGO_ASPECT_RATIO = "5 / 2";

export const UPLOAD_IMAGE_WIDTH = 168;
export const UPLOAD_DOCUMENT_WIDTH = 260;
export const UPLOAD_COMPACT_WIDTH = 120;

function isImageAccept(accept) {
  if (!accept) return true;
  const a = accept.toLowerCase();
  return a.includes("image") || a === "*/*";
}

function isImagePreviewUrl(url) {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(url || "");
}

function isPdfPreviewUrl(url) {
  return /\.pdf(\?|$)/i.test(url || "");
}

/** Click preview area to upload — GJM-style content-sized zones */
export default function ImageField({
  label,
  showLabel = true,
  value,
  previewUrl,
  onChange,
  accept = "image/*",
  capture,
  resizePreset,
  required = false,
  error,
  compact = false,
  fullWidth = false,
  variant = "default",
  documentCardPreset = "default",
  avatarSize = "default",
  allowRemove = true,
  hideAvatarHint = false,
  gallerySlot = false,
  sx,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const inputId = useId();
  const inputRef = useRef(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!(value instanceof File)) {
      setObjectUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(value);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const imageAccept = isImageAccept(accept);
  const isAvatar = variant === "avatar";
  const isLogo = variant === "logo";
  const isDocumentCard = variant === "documentCard";
  const isDetailDocCard = isDocumentCard && documentCardPreset === "detail";
  const isDetailWideDocCard = isDocumentCard && documentCardPreset === "detailWide";
  const avatarPx = avatarSize === "large" ? AVATAR_SIZE_LARGE : AVATAR_SIZE;

  const minH = isAvatar
    ? avatarPx
    : isLogo
      ? LOGO_MIN_HEIGHT
      : isDetailDocCard
      ? DOCUMENT_CARD_DETAIL_MIN
      : isDocumentCard
        ? DOCUMENT_CARD_MIN_HEIGHT
        : compact
          ? COMPACT_MIN_HEIGHT
          : PREVIEW_MIN_HEIGHT;
  const maxH = isAvatar
    ? avatarPx
    : isLogo
      ? LOGO_MAX_HEIGHT
      : isDetailDocCard || isDetailWideDocCard
      ? undefined
      : isDocumentCard
        ? DOCUMENT_CARD_MAX_HEIGHT
        : compact
          ? COMPACT_MAX_HEIGHT
          : PREVIEW_MAX_HEIGHT;

  const docAspectRatio = isLogo
    ? LOGO_ASPECT_RATIO
    : isDetailDocCard
      ? "1 / 1"
      : isDetailWideDocCard
        ? "4 / 3"
        : null;

  const resolvedPreview = previewUrl ? resolveMediaUrl(previewUrl) : null;

  const canPreviewImageUrl = (url) => {
    if (!url || isPdfPreviewUrl(url)) return false;
    return imageAccept ? true : isImagePreviewUrl(url);
  };

  const displaySrc =
    value instanceof File && value.type.startsWith("image/")
      ? objectUrl
      : typeof value === "string" && value.trim() && canPreviewImageUrl(resolveMediaUrl(value))
        ? resolveMediaUrl(value)
        : !value && resolvedPreview && canPreviewImageUrl(resolvedPreview)
          ? resolvedPreview
          : null;

  const pdfPreviewSrc =
    !displaySrc &&
    !(value instanceof File) &&
    resolvedPreview &&
    isPdfPreviewUrl(resolvedPreview)
      ? resolvedPreview
      : null;

  const fileLabel =
    value instanceof File
      ? value.name
      : previewUrl
        ? decodeURIComponent(String(previewUrl).split("/").pop() || "")
        : null;

  const hasSelection = Boolean(displaySrc || pdfPreviewSrc || fileLabel);
  const uploadHint = imageAccept
    ? t("fields.imageUploadHint")
    : t("fields.fileUploadHint", { defaultValue: "Click to choose a file" });
  const isLight = theme.palette.mode === "light";
  const { primary } = brandFromTheme(theme);
  const zoneWidth = isAvatar
    ? avatarPx
    : isDocumentCard || fullWidth
      ? "100%"
      : compact
        ? UPLOAD_COMPACT_WIDTH
        : imageAccept
          ? UPLOAD_IMAGE_WIDTH
          : UPLOAD_DOCUMENT_WIDTH;

  const openPicker = () => {
    if (processing) return;
    inputRef.current?.click();
  };

  const handleFile = async (e) => {
    const raw = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!raw) {
      onChange(null);
      return;
    }
    const preset = resizePreset || (capture ? "checkin" : null);
    if (preset && raw.type.startsWith("image/")) {
      setProcessing(true);
      try {
        const resized = await resizeImageFile(raw, preset);
        onChange(resized);
      } catch {
        onChange(raw);
      } finally {
        setProcessing(false);
      }
      return;
    }
    onChange(raw);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadZone = (
    <Box
      sx={{
        width: zoneWidth,
        maxWidth: "100%",
        borderRadius: isAvatar ? "50%" : gallerySlot ? 2.5 : `${FIELD_RADIUS}px`,
        border: gallerySlot && !hasSelection ? "2px dashed" : "1px solid",
        borderColor: error
          ? "error.main"
          : gallerySlot && !hasSelection
            ? (theme) => alpha(primary, theme.palette.mode === "light" ? 0.28 : 0.4)
            : "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        flexShrink: 0,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        boxShadow: gallerySlot && hasSelection ? 2 : "none",
        "&:focus-within": {
          borderColor: error ? "error.main" : primary,
          borderStyle: "solid",
          boxShadow: `0 0 0 3px ${alpha(primary, 0.14)}`,
        },
        ...(gallerySlot
          ? {
              "&:hover": {
                transform: hasSelection ? "translateY(-1px)" : "none",
                boxShadow: hasSelection ? 4 : 1,
              },
            }
          : {}),
      }}
    >
      <Box
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        aria-label={uploadHint}
        sx={{
          position: "relative",
          ...(docAspectRatio
            ? {
                width: "100%",
                aspectRatio: docAspectRatio,
                minHeight: gallerySlot
                  ? { xs: 160, sm: 180 }
                  : isDetailDocCard
                    ? { xs: DOCUMENT_CARD_DETAIL_MIN, sm: 220, md: 240 }
                    : { xs: 180, sm: 200 },
                maxHeight: "none",
              }
            : {
                minHeight: minH,
                maxHeight: maxH,
                width: isAvatar ? avatarPx : "100%",
              }),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: processing ? "wait" : "pointer",
          pointerEvents: processing ? "none" : "auto",
          bgcolor: isLight
            ? alpha(primary, 0.03)
            : alpha(primary, 0.08),
          backgroundImage:
            hasSelection || isAvatar
              ? "none"
              : `repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 6px,
                  ${alpha(primary, isLight ? 0.04 : 0.06)} 6px,
                  ${alpha(primary, isLight ? 0.04 : 0.06)} 12px
                )`,
          "&:hover": {
            bgcolor: alpha(primary, isLight ? 0.06 : 0.12),
          },
        }}
      >
        {displaySrc ? (
          <Box
            component="img"
            src={displaySrc}
            alt=""
            sx={{
              display: "block",
              ...(docAspectRatio
                ? {
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: isLogo ? "contain" : "cover",
                    objectPosition: "center",
                    p: isLogo ? 2 : 0,
                    boxSizing: "border-box",
                  }
                : {
                    width: isAvatar ? avatarPx : "100%",
                    maxWidth: "100%",
                    height: isAvatar || fullWidth ? minH : "auto",
                    minHeight: isAvatar ? avatarPx : minH,
                    maxHeight: maxH,
                    objectFit: isLogo || (!isAvatar && !fullWidth && !isDocumentCard)
                      ? "contain"
                      : "cover",
                    objectPosition: isAvatar ? "top center" : "center",
                    p: isLogo ? 2 : isAvatar || fullWidth || isDocumentCard ? 0 : 1.5,
                    boxSizing: "border-box",
                  }),
              borderRadius: isAvatar ? "50%" : 0,
            }}
          />
        ) : pdfPreviewSrc ? (
          <Box
            sx={{
              width: "100%",
              height: docAspectRatio ? "100%" : "auto",
              minHeight: docAspectRatio ? "100%" : undefined,
              pointerEvents: "none",
              position: docAspectRatio ? "absolute" : "relative",
              inset: docAspectRatio ? 0 : undefined,
            }}
          >
            <PdfPreview
              url={pdfPreviewSrc}
              title={fileLabel || "PDF preview"}
              height={isDetailWideDocCard ? "100%" : fullWidth ? 280 : Math.max(minH, 200)}
              showOpenButton={false}
            />
          </Box>
        ) : fileLabel ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.75,
              py: 2,
              px: 2,
              color: "text.secondary",
              pointerEvents: "none",
            }}
          >
            <InsertDriveFileOutlinedIcon
              sx={{ fontSize: compact ? 32 : 40, opacity: 0.55, color: primary }}
            />
            <Typography
              variant="body2"
              fontWeight={500}
              textAlign="center"
              sx={{ wordBreak: "break-all" }}
            >
              {fileLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {uploadHint}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.75,
              py: 2,
              px: 2,
              color: "text.secondary",
              pointerEvents: "none",
            }}
          >
            {imageAccept ? (
              <ImageOutlinedIcon
                sx={{
                  fontSize: isAvatar ? 28 : compact ? 32 : 40,
                  opacity: 0.45,
                  color: primary,
                }}
              />
            ) : (
              <InsertDriveFileOutlinedIcon
                sx={{ fontSize: compact ? 32 : 40, opacity: 0.45, color: primary }}
              />
            )}
            {!isAvatar ? (
              <Typography variant="body2" fontWeight={500} textAlign="center">
                {uploadHint}
              </Typography>
            ) : null}
          </Box>
        )}

        {processing ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              bgcolor: (th) => alpha(th.palette.background.paper, 0.85),
              zIndex: 2,
            }}
          >
            <CircularProgress size={26} />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {t("fields.adjustingImage", { defaultValue: "Adjusting…" })}
            </Typography>
          </Box>
        ) : null}

        {hasSelection && !processing && allowRemove ? (
          <IconButton
            size="small"
            color="error"
            onClick={handleRemove}
            aria-label={t("fields.removeImage")}
            sx={{
              position: "absolute",
              top: isAvatar ? 4 : 8,
              right: isAvatar ? 4 : 8,
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );

  return (
    <Box
      className="arrow-upload-field"
      sx={{
        width: fullWidth ? "100%" : "fit-content",
        maxWidth: "100%",
        ...sx,
      }}
    >
      {showLabel && label ? (
        <Typography
          variant="body2"
          fontWeight={600}
          gutterBottom
          component="label"
          htmlFor={inputId}
          sx={{ cursor: "pointer" }}
        >
          {label}
          {required ? (
            <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
              {" *"}
            </Typography>
          ) : null}
        </Typography>
      ) : null}

      {isAvatar ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: hideAvatarHint ? 0 : 2 }}>
          {uploadZone}
          {!hideAvatarHint ? (
            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 200 }}>
              {uploadHint}
            </Typography>
          ) : null}
        </Box>
      ) : (
        uploadZone
      )}

      {pdfPreviewSrc ? (
        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          <Typography
            component="a"
            href={pdfPreviewSrc}
            target="_blank"
            rel="noreferrer"
            variant="caption"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            {t("common.viewPdf", { defaultValue: "Open PDF in new tab" })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("fields.keepExistingFile", {
              defaultValue: "Upload a new file only to replace the current PDF.",
            })}
          </Typography>
        </Box>
      ) : null}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        hidden
        accept={accept}
        capture={capture || undefined}
        onChange={handleFile}
      />
    </Box>
  );
}
