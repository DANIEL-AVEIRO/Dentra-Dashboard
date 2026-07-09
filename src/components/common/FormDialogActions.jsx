import ToolbarActionButton from "@/components/common/ToolbarActionButton";
import ActionButton from "@/components/common/ActionButton";

/**
 * Cancel + primary action pair for dialog / panel footers.
 */
export default function FormDialogActions({
  onCancel,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Save",
  confirmIntent = "save",
  confirmType = "button",
  busy = false,
  confirmDisabled = false,
  cancelDisabled = false,
  size = "small",
  autoFocusConfirm = false,
}) {
  return (
    <>
      <ToolbarActionButton
        variant="cancel"
        size={size}
        onClick={onCancel}
        disabled={busy || cancelDisabled}
      >
        {cancelLabel}
      </ToolbarActionButton>
      <ActionButton
        type={confirmType}
        size={size}
        intent={confirmIntent}
        onClick={onConfirm}
        disabled={confirmDisabled || busy}
        loading={busy}
        autoFocus={autoFocusConfirm}
      >
        {confirmLabel}
      </ActionButton>
    </>
  );
}
