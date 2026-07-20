import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import ActionButton from "@/components/common/ActionButton";
import { FormField } from "@/components/common/form";
import SearchableSelect, { normalizeOptions } from "@/components/common/SearchableSelect";
import SmoothDatePicker from "@/components/common/SmoothDatePicker";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import { formatCaseMoney } from "@/utils/caseLineItemMoney";
import { pageShellSx, pageSectionPaperSx } from "@/constants/pageLayout";

export default function ClinicStatementsPage() {
  const { t } = useTranslation();
  const [clinics, setClinics] = useState([]);
  const [clinic, setClinic] = useState("");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    client
      .get("/clinics/")
      .then(({ data: res }) => {
        const list = res.results ?? res;
        setClinics(normalizeOptions(list, { labelKey: "name" }));
      })
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    if (!clinic) {
      toast.error(
        t("pages.clinicStatements.selectClinic", {
          defaultValue: "Select a clinic",
        }),
      );
      return;
    }
    setBusy(true);
    try {
      const params = { clinic };
      if (from) params.from = from;
      if (to) params.to = to;
      const { data: res } = await client.get("/clinic-statements/", { params });
      setData(res);
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.loadFailed")));
    } finally {
      setBusy(false);
    }
  }, [clinic, from, to, t]);

  return (
    <Box className="page-enter" sx={pageShellSx}>
      <PageHeader
        title={t("pages.clinicStatements.title")}
        subtitle={t("pages.clinicStatements.subtitle")}
      />
      <Paper elevation={0} sx={{ ...pageSectionPaperSx, p: 2.5, mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "flex-end" }}
        >
          <Box sx={{ flex: 1, minWidth: { md: 220 }, width: { xs: "100%", md: "auto" } }}>
            <FormField label={t("fields.clinic_name")}>
              <SearchableSelect
                options={clinics}
                value={clinic}
                onChange={setClinic}
                placeholder={t("fields.clinic_name")}
              />
            </FormField>
          </Box>
          <Box sx={{ minWidth: { md: 160 }, width: { xs: "100%", md: "auto" } }}>
            <FormField label={t("filters.from")}>
              <SmoothDatePicker value={from} onChange={setFrom} />
            </FormField>
          </Box>
          <Box sx={{ minWidth: { md: 160 }, width: { xs: "100%", md: "auto" } }}>
            <FormField label={t("filters.to")}>
              <SmoothDatePicker value={to} onChange={setTo} />
            </FormField>
          </Box>
          <ActionButton
            intent="confirm"
            size="small"
            loading={busy}
            onClick={load}
            sx={{
              flexShrink: 0,
              alignSelf: { xs: "stretch", md: "auto" },
              minHeight: 42,
              px: 2,
              whiteSpace: "nowrap",
            }}
          >
            {t("pages.clinicStatements.load", { defaultValue: "Load statement" })}
          </ActionButton>
        </Stack>
      </Paper>

      {data ? (
        <Paper elevation={0} sx={{ ...pageSectionPaperSx, p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {data.clinic_name}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Opening AR
              </Typography>
              <Typography fontWeight={700}>{formatCaseMoney(data.opening_ar)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Period invoices
              </Typography>
              <Typography fontWeight={700}>
                {formatCaseMoney(data.period_invoices)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Period payments
              </Typography>
              <Typography fontWeight={700}>
                {formatCaseMoney(data.period_payments)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Closing AR
              </Typography>
              <Typography fontWeight={700} color="primary.main">
                {formatCaseMoney(data.closing_ar)}
              </Typography>
            </Box>
          </Stack>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Aging
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
            0–30: {formatCaseMoney(data.aging?.["0_30"])} · 31–60:{" "}
            {formatCaseMoney(data.aging?.["31_60"])} · 61–90:{" "}
            {formatCaseMoney(data.aging?.["61_90"])} · 90+:{" "}
            {formatCaseMoney(data.aging?.["90_plus"])}
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data.ledger || []).map((row, i) => (
                <TableRow key={`${row.reference}-${i}`}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.reference}</TableCell>
                  <TableCell align="right">{formatCaseMoney(row.debit)}</TableCell>
                  <TableCell align="right">{formatCaseMoney(row.credit)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : null}
    </Box>
  );
}
