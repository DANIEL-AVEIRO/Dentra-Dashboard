import { useCallback, useState } from "react";
import client from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { clearBrowserCache } from "@/utils/cacheClear";
import { toast, getErrorMessage } from "@/utils/toast";

/**
 * Clear browser cache (and optional server cache for staff). Reloads the app.
 */
export function useClearCache({
  preserveAuth = true,
  preserveTheme = true,
  clearServer = true,
} = {}) {
  const { t } = useTranslation();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const isStaff = Boolean(user?.is_staff || user?.is_superuser);

  const clearCache = useCallback(async () => {
    const ok = await confirm({
      title: t("confirm.title.clearCache"),
      message: t("confirm.clearCache"),
      confirmLabel: t("pages.settings.cache.clearButton"),
      confirmColor: "warning",
    });
    if (!ok) return;

    setLoading(true);
    try {
      if (clearServer && isStaff) {
        const { data } = await client.post("/system/clear-cache/");
        toast.success(data.detail || t("toast.cacheCleared"));
      }
      await clearBrowserCache({ preserveAuth, preserveTheme });
      toast.success(t("toast.cacheCleared"));
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.cacheFailed")));
      setLoading(false);
    }
  }, [
    clearServer,
    confirm,
    isStaff,
    preserveAuth,
    preserveTheme,
    t,
  ]);

  return { clearCache, loading, ConfirmDialog, isStaff };
}
