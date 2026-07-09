import { useCallback, useRef, useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useTranslation } from "@/context/LanguageContext";

const INITIAL = {
  open: false,
  title: "",
  message: "",
  confirmLabel: "",
  cancelLabel: "",
  confirmColor: "primary",
  loading: false,
};

/**
 * Promise-based confirm modal (drop-in replacement for window.confirm).
 *
 * @example
 * const { confirm, ConfirmDialog } = useConfirmDialog();
 * const ok = await confirm({ title: '...', message: '...', confirmColor: 'error' });
 * if (!ok) return;
 */
export function useConfirmDialog() {
  const { t } = useTranslation();
  const [state, setState] = useState(INITIAL);
  const resolverRef = useRef(null);

  const settle = useCallback((result) => {
    setState((s) => ({ ...s, open: false, loading: false }));
    const resolve = resolverRef.current;
    resolverRef.current = null;
    resolve?.(result);
  }, []);

  const confirm = useCallback(
    (options = {}) =>
      new Promise((resolve) => {
        resolverRef.current = resolve;
        setState({
          open: true,
          title: options.title ?? t("common.confirm"),
          message: options.message ?? "",
          confirmLabel: options.confirmLabel ?? t("common.confirm"),
          cancelLabel: options.cancelLabel ?? t("common.cancel"),
          confirmColor: options.confirmColor ?? "primary",
          loading: false,
        });
      }),
    [t]
  );

  const setLoading = useCallback((loading) => {
    setState((s) => ({ ...s, loading }));
  }, []);

  const ConfirmDialogHost = useCallback(
    () => (
      <ConfirmDialog
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        confirmColor={state.confirmColor}
        loading={state.loading}
        onCancel={() => settle(false)}
        onConfirm={() => settle(true)}
      />
    ),
    [state, settle]
  );

  return { confirm, setConfirmLoading: setLoading, ConfirmDialog: ConfirmDialogHost };
}
