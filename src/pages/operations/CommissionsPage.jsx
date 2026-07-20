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
import SmoothDatePicker from "@/components/common/SmoothDatePicker";
import { FormField } from "@/components/common/form";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import { formatCaseMoney } from "@/utils/caseLineItemMoney";
import { pageShellSx, pageSectionPaperSx } from "@/constants/pageLayout";

export default function CommissionsPage() {
  const { t } = useTranslation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const { data: payload } = await client.get("/commissions/report/", { params });
      setData(payload);
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.loadFailed")));
    } finally {
      setLoading(false);
    }
  }, [from, to, t]);

  useEffect(() => {
    load();
  }, [load]);

  const rows = data?.rows || [];

  return (
    <Box className="page-enter" sx={pageShellSx}>
      <PageHeader
        title={t("pages.commissions.title", { defaultValue: "Commissions" })}
        subtitle={t("pages.commissions.subtitle", {
          defaultValue: "Technician commission report by assigned cases",
        })}
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
        alignItems="flex-end"
      >
        <FormField label={t("filters.from", { defaultValue: "From" })}>
          <SmoothDatePicker value={from || null} onChange={(v) => setFrom(v || "")} />
        </FormField>
        <FormField label={t("filters.to", { defaultValue: "To" })}>
          <SmoothDatePicker value={to || null} onChange={(v) => setTo(v || "")} />
        </FormField>
        <ActionButton intent="save" size="small" onClick={load} loading={loading}>
          {t("common.refresh", { defaultValue: "Refresh" })}
        </ActionButton>
      </Stack>

      <Paper elevation={0} sx={{ ...pageSectionPaperSx, p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("fields.username", { defaultValue: "User" })}</TableCell>
              <TableCell align="right">
                {t("pages.commissions.percent", { defaultValue: "%" })}
              </TableCell>
              <TableCell align="right">
                {t("pages.commissions.cases", { defaultValue: "Cases" })}
              </TableCell>
              <TableCell align="right">
                {t("pages.commissions.amount", { defaultValue: "Amount" })}
              </TableCell>
              <TableCell align="right">
                {t("pages.commissions.commission", { defaultValue: "Commission" })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.user_id} hover>
                <TableCell>{row.user_name}</TableCell>
                <TableCell align="right">{row.percent}</TableCell>
                <TableCell align="right">{row.cases_count}</TableCell>
                <TableCell align="right">{formatCaseMoney(row.amount_total)}</TableCell>
                <TableCell align="right">{formatCaseMoney(row.commission_total)}</TableCell>
              </TableRow>
            ))}
            {!loading && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color="text.secondary">{t("common.noResults")}</Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {rows.length > 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="right">
                  <Typography fontWeight={700}>
                    {t("pages.commissions.grandTotal", { defaultValue: "Grand total" })}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={700}>
                    {formatCaseMoney(data?.grand_total)}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
