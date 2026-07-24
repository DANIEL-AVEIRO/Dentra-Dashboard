import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import PageHeader from "@/components/common/PageHeader";
import ActionButton from "@/components/common/ActionButton";
import FormDialogActions from "@/components/common/FormDialogActions";
import { FormField, ProTextField } from "@/components/common/form";
import SmoothDatePicker from "@/components/common/SmoothDatePicker";
import ResponsiveDialog from "@/components/common/ResponsiveDialog";
import { TableActionButton } from "@/components/common/TableActions";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { formatCaseMoney } from "@/utils/caseLineItemMoney";
import { pageShellSx } from "@/constants/pageLayout";
import { INVOICE_COLUMNS } from "@/pages/operations/financeFormConfig";
import { printInvoice } from "@/utils/printDocuments";

const REDO_TOAST = {
  ready: "Case sent back to Deliveries",
  shipped: "Case sent back to Deliveries",
  qc: "Case sent back to QC",
  received: "Case sent back to Fabrication",
  in_fabrication: "Case sent back to Fabrication",
};

export default function BillingPage() {
  const { t } = useTranslation();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [tab, setTab] = useState(0);
  const [unbilled, setUnbilled] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [loadingUnbilled, setLoadingUnbilled] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [busy, setBusy] = useState(false);
  const [listKey, setListKey] = useState(0);

  const loadUnbilled = useCallback(async () => {
    setLoadingUnbilled(true);
    try {
      const { data } = await client.get("/invoices/unbilled-cases/");
      setUnbilled(Array.isArray(data) ? data : []);
      setSelected(new Set());
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.loadFailed")));
    } finally {
      setLoadingUnbilled(false);
    }
  }, [t]);

  useEffect(() => {
    if (tab === 0) loadUnbilled();
  }, [tab, loadUnbilled]);

  const selectedRows = useMemo(
    () => unbilled.filter((r) => selected.has(r.id)),
    [unbilled, selected],
  );

  const subtotal = useMemo(
    () => selectedRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [selectedRows],
  );

  const grandTotal = Math.max(
    0,
    subtotal - (Number(discount) || 0) + (Number(tax) || 0),
  );

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openWizard = () => {
    if (selectedRows.length === 0) {
      toast.error(
        t("pages.billing.selectCases", {
          defaultValue: "Select at least one unbilled case.",
        }),
      );
      return;
    }
    const clinics = new Set(selectedRows.map((r) => r.clinic).filter(Boolean));
    if (clinics.size !== 1) {
      toast.error(
        t("pages.billing.sameClinic", {
          defaultValue: "Selected cases must belong to the same clinic.",
        }),
      );
      return;
    }
    setDiscount("");
    setTax("");
    setDueDate(null);
    setWizardOpen(true);
  };

  const createInvoice = async (issue) => {
    setBusy(true);
    try {
      const payload = {
        case_ids: selectedRows.map((r) => r.id),
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
      };
      if (dueDate) payload.due_date = dueDate;
      const { data } = await client.post("/invoices/", payload);
      if (issue) {
        await client.post(`/invoices/${data.id}/issue/`);
        toast.success(
          t("pages.billing.issued", { defaultValue: "Invoice issued" }),
        );
      } else {
        toast.success(
          t("pages.billing.draftSaved", { defaultValue: "Invoice draft saved" }),
        );
      }
      setWizardOpen(false);
      await loadUnbilled();
      setListKey((k) => k + 1);
      setTab(1);
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.saveFailed")));
    } finally {
      setBusy(false);
    }
  };

  const handleIssue = useCallback(
    async (row, refresh) => {
      try {
        await client.post(`/invoices/${row.id}/issue/`);
        toast.success(
          t("pages.billing.issued", { defaultValue: "Invoice issued" }),
        );
        refresh?.();
      } catch (err) {
        toast.error(getErrorMessage(err, t("toast.saveFailed")));
      }
    },
    [t],
  );

  const handleRedo = useCallback(
    async (row) => {
      const ok = await confirm({
        title: t("pages.billing.redoTitle", { defaultValue: "Redo case?" }),
        message: t("pages.billing.redoMessage", {
          defaultValue:
            "Send case {{caseId}} back to the previous workflow step?",
          caseId: row.case_id || row.id,
        }),
        confirmLabel: t("pages.billing.redo", { defaultValue: "Redo" }),
        confirmColor: "warning",
      });
      if (!ok) return;
      try {
        const { data } = await client.post(`/cases/${row.id}/redo/`);
        toast.success(
          t("pages.billing.redone", {
            defaultValue: REDO_TOAST[data?.status] || "Case sent back",
          }),
        );
        await loadUnbilled();
      } catch (err) {
        toast.error(getErrorMessage(err, t("toast.saveFailed")));
      }
    },
    [confirm, loadUnbilled, t],
  );

  return (
    <Box className="page-enter" sx={pageShellSx}>
      <PageHeader
        title={t("pages.billing.title")}
        subtitle={t("pages.billing.subtitle")}
      />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab
          label={t("pages.billing.unbilled", { defaultValue: "Unbilled cases" })}
        />
        <Tab
          label={t("pages.billing.invoices", { defaultValue: "Invoices" })}
        />
      </Tabs>

      {tab === 0 ? (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {loadingUnbilled
                ? t("common.loading")
                : t("pages.billing.unbilledCount", {
                    count: unbilled.length,
                    defaultValue: "{{count}} delivered cases ready to bill",
                  })}
            </Typography>
            <ActionButton intent="create" size="small" onClick={openWizard}>
              {t("pages.billing.generateInvoice", {
                defaultValue: "Generate invoice",
              })}
            </ActionButton>
          </Stack>
          <Stack spacing={1}>
            {unbilled.map((row) => (
              <Stack
                key={row.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selected.has(row.id)}
                      onChange={() => toggle(row.id)}
                    />
                  }
                  label={`${row.case_id} · ${row.patient_name || "—"} · ${row.clinic_name || "—"} · ${formatCaseMoney(row.amount)}`}
                />
                <TableActionButton
                  variant="restore"
                  title={t("pages.billing.redo", { defaultValue: "Redo" })}
                  onClick={() => handleRedo(row)}
                />
              </Stack>
            ))}
            {!loadingUnbilled && unbilled.length === 0 ? (
              <Typography color="text.secondary">
                {t("pages.billing.noUnbilled", {
                  defaultValue: "No unbilled delivered cases.",
                })}
              </Typography>
            ) : null}
          </Stack>
        </Box>
      ) : (
        <ResourceListPage
          key={listKey}
          endpoint="invoices"
          pageKey="billing"
          columns={INVOICE_COLUMNS}
          fields={[]}
          canCreate={false}
          canEdit={false}
          extraRowActions={(row, { refresh } = {}) => (
            <>
              <TableActionButton
                variant="view"
                title={t("pages.billing.printInvoice", {
                  defaultValue: "Print invoice",
                })}
                onClick={() => printInvoice(row)}
              />
              {row.status === "draft" ? (
                <TableActionButton
                  variant="status"
                  title={t("pages.billing.issue", { defaultValue: "Issue" })}
                  onClick={() => handleIssue(row, refresh)}
                />
              ) : null}
            </>
          )}
        />
      )}

      <ResponsiveDialog
        open={wizardOpen}
        onClose={() => !busy && setWizardOpen(false)}
        maxWidth="sm"
      >
        <Box sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("pages.billing.wizardTitle", { defaultValue: "New invoice" })}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedRows.length} case(s) · Subtotal {formatCaseMoney(subtotal)}
          </Typography>
          <Stack spacing={2}>
            <FormField label={t("fields.discount")}>
              <ProTextField
                labelPlacement="outlined"
                fullWidth
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </FormField>
            <FormField label={t("fields.tax")}>
              <ProTextField
                labelPlacement="outlined"
                fullWidth
                type="number"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
              />
            </FormField>
            <FormField label={t("fields.due_date")}>
              <SmoothDatePicker value={dueDate} onChange={(v) => setDueDate(v)} />
            </FormField>
            <Typography fontWeight={700}>
              {t("fields.grand_total")}: {formatCaseMoney(grandTotal)}
            </Typography>
          </Stack>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
          >
            <FormDialogActions
              onCancel={() => setWizardOpen(false)}
              cancelLabel={t("common.cancel")}
              confirmLabel={t("pages.billing.saveDraft", {
                defaultValue: "Save draft",
              })}
              confirmIntent="save"
              onConfirm={() => createInvoice(false)}
              busy={busy}
            />
            <ActionButton
              intent="create"
              size="small"
              disabled={busy}
              loading={busy}
              onClick={() => createInvoice(true)}
            >
              {t("pages.billing.saveIssue", {
                defaultValue: "Save & issue",
              })}
            </ActionButton>
          </Box>
        </Box>
      </ResponsiveDialog>
      <ConfirmDialog />
    </Box>
  );
}
