import { useCallback, useEffect, useState } from "react";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import { TableActionButton } from "@/components/common/TableActions";
import FormDialogActions from "@/components/common/FormDialogActions";
import SearchableSelect, {
  normalizeOptions,
} from "@/components/common/SearchableSelect";
import ResponsiveDialog from "@/components/common/ResponsiveDialog";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import {
  CASE_PRIORITY_COLUMN,
  CASE_STATUS_COLUMN,
} from "@/pages/operations/caseFormConfig";
import { printWorkTicket } from "@/utils/printDocuments";

const WORKBOARD_COLUMNS = [
  { key: "case_id", labelKey: "fields.case_id" },
  { key: "patient_name", labelKey: "fields.patient_name" },
  { key: "clinic_name", labelKey: "fields.clinic_name" },
  { key: "assigned_to_name", labelKey: "fields.assigned_to_name" },
  { key: "priority", labelKey: "fields.priority", ...CASE_PRIORITY_COLUMN },
  { key: "status", labelKey: "fields.status", ...CASE_STATUS_COLUMN },
  { key: "due_date", labelKey: "fields.due_date" },
  { key: "sla_due_at", labelKey: "fields.sla_due_at" },
];

export default function WorkboardPage() {
  const { t } = useTranslation();
  const [assignRow, setAssignRow] = useState(null);
  const [assignee, setAssignee] = useState("");
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/users/", { params: { page_size: 200 } });
        const list = data.results ?? data;
        if (!cancelled) {
          setUsers(
            (Array.isArray(list) ? list : []).map((u) => ({
              value: u.id,
              label: u.username || u.email || String(u.id),
            })),
          );
        }
      } catch {
        if (!cancelled) setUsers([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openAssign = useCallback((row) => {
    setAssignRow(row);
    setAssignee(row.assigned_to || "");
  }, []);

  const submitAssign = async () => {
    if (!assignRow) return;
    setBusy(true);
    try {
      await client.post(`/cases/${assignRow.id}/assign/`, {
        assigned_to: assignee || null,
      });
      toast.success(
        t("pages.workboard.assigned", { defaultValue: "Case assigned" }),
      );
      setAssignRow(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.saveFailed")));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <ResourceListPage
        key={refreshKey}
        endpoint="cases"
        pageKey="workboard"
        columns={WORKBOARD_COLUMNS}
        fields={[]}
        canCreate={false}
        canEdit={false}
        canDelete={false}
        listParams={{ pipeline: "fabrication" }}
        trashResourceId="cases"
        extraRowActions={(row) => (
          <>
            <TableActionButton
              variant="assign"
              title={t("pages.workboard.assign", { defaultValue: "Assign" })}
              onClick={() => openAssign(row)}
            />
            <TableActionButton
              variant="view"
              title={t("pages.workboard.printTicket", {
                defaultValue: "Print work ticket",
              })}
              onClick={() => printWorkTicket(row)}
            />
          </>
        )}
      />

      <ResponsiveDialog
        open={Boolean(assignRow)}
        onClose={() => !busy && setAssignRow(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {t("pages.workboard.assignTitle", {
            defaultValue: "Assign case",
          })}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {assignRow?.case_id}
            </Typography>
            <Box>
              <SearchableSelect
                labelPlacement="top"
                value={assignee}
                onChange={setAssignee}
                options={normalizeOptions(users)}
                placeholder={t("pages.workboard.selectUser", {
                  defaultValue: "Select technician…",
                })}
                clearable
                searchable
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <FormDialogActions
            onCancel={() => setAssignRow(null)}
            cancelLabel={t("common.cancel")}
            confirmLabel={t("common.assign", { defaultValue: "Assign" })}
            onConfirm={submitAssign}
            busy={busy}
          />
        </DialogActions>
      </ResponsiveDialog>
    </>
  );
}
