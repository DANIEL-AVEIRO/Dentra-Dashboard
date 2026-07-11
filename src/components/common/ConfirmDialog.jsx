import { DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import ResponsiveDialog from "@/components/common/ResponsiveDialog";
import FormDialogActions from "@/components/common/FormDialogActions";
import { resolveButtonIntent } from "@/constants/buttonIntents";
import { formDialogActionsSx } from "@/components/common/statusDialogLayout";

/**
 * Branded confirmation modal — replaces window.confirm across the dashboard.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "primary",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <ResponsiveDialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title" sx={{ pb: 0.5 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        {typeof message === "string" ? (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        ) : (
          message
        )}
      </DialogContent>
      <DialogActions sx={formDialogActionsSx}>
        <FormDialogActions
          onCancel={onCancel}
          onConfirm={onConfirm}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          confirmIntent={resolveButtonIntent({ color: confirmColor })}
          busy={loading}
          autoFocusConfirm
        />
      </DialogActions>
    </ResponsiveDialog>
  );
}
