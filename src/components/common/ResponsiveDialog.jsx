import { Dialog, useMediaQuery, useTheme } from "@mui/material";

const LARGE_MAX_WIDTHS = new Set(["md", "lg", "xl", false]);

/** Bottom-anchored sheet for compact dialogs on phones */
export const responsiveDialogSheetSx = {
  width: "100%",
  maxWidth: "100%",
  maxHeight: "min(92dvh, calc(100dvh - env(safe-area-inset-top, 0px)))",
  margin: 0,
  borderRadius: "16px 16px 0 0",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

/** Centered floating card — fallback when sheet / fullscreen are not used */
export const responsiveDialogPaperSx = {
  width: "calc(100% - 24px)",
  maxWidth: "calc(100% - 24px)",
  maxHeight:
    "calc(100dvh - 24px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
  margin: 12,
  display: "flex",
  flexDirection: "column",
  borderRadius: 2,
  overflow: "hidden",
};

export const responsiveDialogFullScreenPaperSx = {
  display: "flex",
  flexDirection: "column",
  pt: "env(safe-area-inset-top, 0px)",
  pb: "env(safe-area-inset-bottom, 0px)",
};

function isLargeDialog(maxWidth) {
  return LARGE_MAX_WIDTHS.has(maxWidth);
}

function mergeSlotSx(mobileSx, slot = {}) {
  const { sx, ...rest } = slot;
  const extra = Array.isArray(sx) ? sx : sx ? [sx] : [];
  return {
    ...rest,
    sx: mobileSx ? [mobileSx, ...extra] : sx,
  };
}

export default function ResponsiveDialog({
  fullScreen = false,
  scroll = "paper",
  maxWidth = "sm",
  slotProps,
  ...props
}) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const useFullScreen = fullScreen || (mobile && isLargeDialog(maxWidth));
  const useSheet = mobile && !useFullScreen;

  let mobilePaperSx;
  if (useFullScreen) {
    mobilePaperSx = responsiveDialogFullScreenPaperSx;
  } else if (useSheet) {
    mobilePaperSx = responsiveDialogSheetSx;
  } else if (mobile) {
    mobilePaperSx = responsiveDialogPaperSx;
  }

  const mobileContainerSx = useSheet ? { alignItems: "flex-end" } : undefined;

  return (
    <Dialog
      fullScreen={useFullScreen}
      scroll={scroll}
      maxWidth={maxWidth}
      slotProps={{
        ...slotProps,
        paper: mergeSlotSx(mobilePaperSx, slotProps?.paper),
        container: mergeSlotSx(mobileContainerSx, slotProps?.container),
      }}
      {...props}
    />
  );
}
