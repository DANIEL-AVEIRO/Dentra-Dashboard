import { Dialog, useMediaQuery, useTheme } from "@mui/material";

export const responsiveDialogPaperSx = {
  width: "calc(100% - 32px)",
  maxWidth: "calc(100% - 32px)",
  maxHeight:
    "calc(100dvh - 32px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
  margin: 16,
  display: "flex",
  flexDirection: "column",
};

function mergePaperSx(mobilePaperSx, paperSlot = {}) {
  const { sx, ...rest } = paperSlot;
  const extra = Array.isArray(sx) ? sx : sx ? [sx] : [];
  return {
    ...rest,
    sx: mobilePaperSx ? [mobilePaperSx, ...extra] : sx,
  };
}

export default function ResponsiveDialog({
  fullScreen = false,
  scroll = "paper",
  slotProps,
  ...props
}) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const mobilePaperSx = mobile && !fullScreen ? responsiveDialogPaperSx : undefined;

  return (
    <Dialog
      fullScreen={fullScreen}
      scroll={scroll}
      slotProps={{
        ...slotProps,
        paper: mergePaperSx(mobilePaperSx, slotProps?.paper),
      }}
      {...props}
    />
  );
}
