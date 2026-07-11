import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LaboratoryBrandSection from "@/components/laboratories/LaboratoryBrandSection";
import FormDialogActions from "@/components/common/FormDialogActions";
import { formDialogActionsSx } from "@/components/common/statusDialogLayout";
import { InfoMetaList } from "@/components/common/InfoMetaPanel";
import PageHeader from "@/components/common/PageHeader";
import TableRefreshButton from "@/components/common/TableRefreshButton";
import { FormField, ProTextField } from "@/components/common/form";
import { FormCardSkeleton } from "@/components/common/skeletons";
import ResponsiveDialog from "@/components/common/ResponsiveDialog";
import client from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useBrand } from "@/context/BrandContext";
import { useTranslation } from "@/context/LanguageContext";
import { pageSectionPaperSx } from "@/constants/pageLayout";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import { getErrorMessage, toast } from "@/utils/toast";

function LabLogoPreview({ logoUrl }) {
  const theme = useTheme();
  const resolved = logoUrl ? resolveMediaUrl(logoUrl) : null;

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: 220 },
        flexShrink: 0,
        aspectRatio: "5 / 2",
        borderRadius: 2.5,
        border: 1,
        borderColor: "divider",
        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.04 : 0.1),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        p: 1.5,
        boxSizing: "border-box",
      }}
    >
      {resolved ? (
        <Box
          component="img"
          src={resolved}
          alt=""
          sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
        />
      ) : (
        <ScienceOutlinedIcon sx={{ fontSize: 44, opacity: 0.25, color: "primary.main" }} />
      )}
    </Box>
  );
}

export default function MyLaboratoryPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const { logoUrl } = useBrand();
  const isLabOwner = Boolean(user?.is_lab_owner);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lab, setLab] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchLab = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const { data } = await client.get("/laboratories/", { params: { page_size: 1 } });
      const row = data.results?.[0] ?? data?.[0] ?? null;
      setLab(row);
      setName(row?.name || "");
    } catch (error) {
      toast.error(getErrorMessage(error, t("pages.myLaboratory.loadFailed")));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    fetchLab();
  }, [fetchLab]);

  const metaItems = useMemo(() => {
    if (!lab) return [];
    return [
      {
        key: "plan",
        icon: WorkspacePremiumOutlinedIcon,
        label: t("pages.myLaboratory.fields.plan"),
        value: (
          <Typography variant="body2" fontWeight={600}>
            {lab.plan_name || "—"}
          </Typography>
        ),
      },
      {
        key: "users",
        icon: GroupOutlinedIcon,
        label: t("pages.myLaboratory.fields.users"),
        value: (
          <Typography variant="body2" fontWeight={600}>
            {lab.users_usage ?? lab.users_count ?? "—"}
          </Typography>
        ),
      },
      {
        key: "owner",
        icon: BadgeOutlinedIcon,
        label: t("pages.myLaboratory.fields.owner"),
        value: (
          <Typography variant="body2" fontWeight={600}>
            {lab.owner_name || "—"}
          </Typography>
        ),
      },
      {
        key: "ownerEmail",
        icon: EmailOutlinedIcon,
        label: t("pages.myLaboratory.fields.ownerEmail"),
        value: (
          <Typography variant="body2" fontWeight={600} sx={{ wordBreak: "break-word" }}>
            {lab.owner_email || "—"}
          </Typography>
        ),
      },
    ];
  }, [lab, t]);

  const handleSave = async () => {
    if (!lab?.id) return;
    setSaving(true);
    try {
      const { data } = await client.patch(`/laboratories/${lab.id}/`, { name: name.trim() });
      setLab(data);
      setOpen(false);
      toast.success(t("toast.updated"));
    } catch (error) {
      toast.error(getErrorMessage(error, t("toast.saveFailed")));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <PageHeader
        title={t("pages.myLaboratory.title")}
        subtitle={t("pages.myLaboratory.subtitle")}
        action={
          <TableRefreshButton onRefresh={() => fetchLab(true)} refreshing={refreshing} />
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: isLabOwner ? "minmax(0, 1fr) minmax(0, 380px)" : "1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        {loading ? (
          <FormCardSkeleton fields={4} />
        ) : lab ? (
          <Paper elevation={0} sx={pageSectionPaperSx}>
            <Box
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: 2,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "light" ? 0.05 : 0.1,
                ),
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2.5}
                alignItems={{ xs: "stretch", sm: "flex-start" }}
              >
                <LabLogoPreview logoUrl={logoUrl} />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={1.5}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                        {lab.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {t("pages.myLaboratory.detailsSubtitle")}
                      </Typography>
                    </Box>
                    {isLabOwner ? (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => {
                          setName(lab.name || "");
                          setOpen(true);
                        }}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          borderRadius: 999,
                          flexShrink: 0,
                        }}
                      >
                        {t("common.edit")}
                      </Button>
                    ) : null}
                  </Stack>

                  {lab.plan_name ? (
                    <Chip
                      size="small"
                      icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: "16px !important" }} />}
                      label={lab.plan_name}
                      sx={{
                        mt: 1.5,
                        fontWeight: 700,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        border: "none",
                      }}
                    />
                  ) : null}
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
              <InfoMetaList items={metaItems} />
            </Box>
          </Paper>
        ) : (
          <Paper elevation={0} sx={pageSectionPaperSx}>
            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack spacing={1.5} alignItems="flex-start">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: "primary.main",
                  }}
                >
                  <ScienceOutlinedIcon sx={{ fontSize: 23 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={800}>
                  {t("pages.myLaboratory.emptyTitle")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("pages.myLaboratory.emptySubtitle")}
                </Typography>
                <Chip size="small" label={t("pages.myLaboratory.emptyHint")} />
              </Stack>
            </Box>
          </Paper>
        )}

        {isLabOwner ? <LaboratoryBrandSection /> : null}
      </Box>

      <ResponsiveDialog open={open} onClose={() => !saving && setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t("pages.myLaboratory.editTitle")}</DialogTitle>
        <DialogContent>
          <FormField id="lab-name" label={t("pages.myLaboratory.fields.name")}>
            <ProTextField
              id="field-lab-name"
              labelPlacement="top"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </FormField>
        </DialogContent>
        <DialogActions sx={formDialogActionsSx}>
          <FormDialogActions
            onCancel={() => setOpen(false)}
            onConfirm={handleSave}
            cancelLabel={t("common.cancel")}
            confirmLabel={t("common.save")}
            busy={saving}
            confirmDisabled={!name.trim()}
          />
        </DialogActions>
      </ResponsiveDialog>
    </Box>
  );
}
