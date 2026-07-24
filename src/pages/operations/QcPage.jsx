import { useCallback, useState } from "react";
import {
  Box,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import { TableActionButton } from "@/components/common/TableActions";
import FormDialogActions from "@/components/common/FormDialogActions";
import { FormField, ProTextField } from "@/components/common/form";
import { dialogFormContentSx } from "@/components/common/form/formLayout";
import ResponsiveDialog from "@/components/common/ResponsiveDialog";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { FABRICATION_COLUMNS } from "@/pages/operations/caseFormConfig";

const REDO_TOAST = {
  received: "Case sent back to Fabrication",
  in_fabrication: "Case sent back to Fabrication",
};

export default function QcPage() {
  const { t } = useTranslation();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [open, setOpen] = useState(false);
  const [caseRow, setCaseRow] = useState(null);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const openQc = useCallback(
    async (row) => {
      setCaseRow(row);
      setOpen(true);
      setLoading(true);
      try {
        const { data } = await client.get(`/cases/${row.id}/qc/`);
        const templateItems = data?.template?.items || [];
        const last = data?.last_results || [];
        const byItem = new Map(
          last.map((r) => [String(r.item || r.label_snapshot), r]),
        );
        if (templateItems.length) {
          setItems(
            templateItems.map((item) => {
              const prev = byItem.get(String(item.id));
              return {
                item_id: item.id,
                label: item.label,
                passed: prev ? Boolean(prev.passed) : true,
                notes: prev?.notes || "",
              };
            }),
          );
        } else if (last.length) {
          setItems(
            last.map((r) => ({
              item_id: r.item || null,
              label: r.label_snapshot || r.label || "Check",
              passed: Boolean(r.passed),
              notes: r.notes || "",
            })),
          );
        } else {
          setItems([{ item_id: null, label: "Overall QC", passed: true, notes: "" }]);
        }
      } catch (err) {
        toast.error(getErrorMessage(err, t("toast.loadFailed")));
        setOpen(false);
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  const submitQc = async () => {
    if (!caseRow) return;
    setBusy(true);
    try {
      const { data } = await client.post(`/cases/${caseRow.id}/qc/`, {
        finish: true,
        items: items.map((item) => ({
          item_id: item.item_id,
          label: item.label,
          passed: item.passed,
          notes: item.notes,
        })),
      });
      const next = data?.case?.status;
      const toastMsg =
        next === "delivered"
          ? "QC finished — ready for Billing"
          : "QC finished — moved to Deliveries";
      toast.success(
        t("pages.qc.finished", {
          defaultValue: toastMsg,
        }),
      );
      setOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.saveFailed")));
    } finally {
      setBusy(false);
    }
  };

  const handleRedo = useCallback(
    async (row) => {
      const ok = await confirm({
        title: t("pages.qc.redoTitle", { defaultValue: "Redo case?" }),
        message: t("pages.qc.redoMessage", {
          defaultValue:
            "Send case {{caseId}} back to the previous workflow step?",
          caseId: row.case_id || row.id,
        }),
        confirmLabel: t("pages.qc.redo", { defaultValue: "Redo" }),
        confirmColor: "warning",
      });
      if (!ok) return;
      try {
        const { data } = await client.post(`/cases/${row.id}/redo/`);
        toast.success(
          t("pages.qc.redone", {
            defaultValue: REDO_TOAST[data?.status] || "Case sent back",
          }),
        );
        setRefreshKey((k) => k + 1);
      } catch (err) {
        toast.error(getErrorMessage(err, t("toast.saveFailed")));
      }
    },
    [confirm, t],
  );

  return (
    <>
      <ResourceListPage
        key={refreshKey}
        endpoint="cases"
        pageKey="qc"
        columns={FABRICATION_COLUMNS}
        fields={[]}
        canCreate={false}
        canEdit={false}
        canDelete={false}
        listParams={{ status: "qc" }}
        trashResourceId="cases"
        showRowNumbers={false}
        extraRowActions={(row) => (
          <>
            <TableActionButton
              variant="status"
              title={t("pages.qc.finished", { defaultValue: "Finished" })}
              onClick={() => openQc(row)}
            />
            <TableActionButton
              variant="restore"
              title={t("pages.qc.redo", { defaultValue: "Redo" })}
              onClick={() => handleRedo(row)}
            />
          </>
        )}
      />

      <ResponsiveDialog
        open={open}
        onClose={() => !busy && setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t("pages.qc.dialogTitle", {
            defaultValue: "Quality check",
          })}{" "}
          {caseRow?.case_id ? `· ${caseRow.case_id}` : ""}
        </DialogTitle>
        <DialogContent sx={dialogFormContentSx}>
          {loading ? (
            <Typography color="text.secondary">{t("common.loading")}</Typography>
          ) : (
            <Stack spacing={2}>
              {items.map((item, idx) => (
                <Box key={`${item.item_id || item.label}-${idx}`}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(item.passed)}
                        onChange={(e) => {
                          const next = [...items];
                          next[idx] = { ...item, passed: e.target.checked };
                          setItems(next);
                        }}
                      />
                    }
                    label={item.label}
                  />
                  <FormField label={t("fields.notes")}>
                    <ProTextField
                      labelPlacement="outlined"
                      fullWidth
                      value={item.notes}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = { ...item, notes: e.target.value };
                        setItems(next);
                      }}
                    />
                  </FormField>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <FormDialogActions
            onCancel={() => setOpen(false)}
            cancelLabel={t("common.cancel")}
            confirmLabel={t("pages.qc.finished", { defaultValue: "Finished" })}
            onConfirm={submitQc}
            busy={busy || loading}
          />
        </DialogActions>
      </ResponsiveDialog>
      <ConfirmDialog />
    </>
  );
}
