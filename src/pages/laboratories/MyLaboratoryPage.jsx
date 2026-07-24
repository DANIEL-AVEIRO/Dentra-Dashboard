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
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import LaboratoryBrandSection from "@/components/laboratories/LaboratoryBrandSection";
import FormDialogActions from "@/components/common/FormDialogActions";
import { formDialogActionsSx } from "@/components/common/statusDialogLayout";
import PageHeader from "@/components/common/PageHeader";
import TableRefreshButton from "@/components/common/TableRefreshButton";
import { FormField, ProTextField } from "@/components/common/form";
import { dialogFormContentSx } from "@/components/common/form/formLayout";
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
        width: { xs: 112, sm: 132 },
        height: { xs: 112, sm: 132 },
        flexShrink: 0,
        borderRadius: 3,
        border: 1,
        borderColor: alpha(theme.palette.common.white, 0.28),
        bgcolor: alpha(theme.palette.common.white, theme.palette.mode === "light" ? 0.92 : 0.12),
        boxShadow: `0 10px 28px ${alpha(theme.palette.common.black, 0.12)}`,
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
        <ScienceOutlinedIcon sx={{ fontSize: 40, opacity: 0.35, color: "primary.main" }} />
      )}
    </Box>
  );
}

function MetaTile({ icon: Icon, label, value }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100%",
        p: 1.75,
        borderRadius: 2.5,
        border: 1,
        borderColor: "divider",
        bgcolor: alpha(
          theme.palette.primary.main,
          theme.palette.mode === "light" ? 0.03 : 0.08,
        ),
        transition: "border-color 0.15s ease, background-color 0.15s ease",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.28),
          bgcolor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === "light" ? 0.055 : 0.12,
          ),
        },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            display="block"
            sx={{ letterSpacing: 0.2 }}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ mt: 0.35, wordBreak: "break-word", lineHeight: 1.35 }}
          >
            {value ?? "—"}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default function MyLaboratoryPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const { logoUrl } = useBrand();
  const isLabOwner = Boolean(user?.is_lab_owner);
  const isLight = theme.palette.mode === "light";
  const primary = theme.palette.primary.main;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lab, setLab] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [labCode, setLabCode] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchLab = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const { data } = await client.get("/laboratories/", { params: { page_size: 1 } });
      const row = data.results?.[0] ?? data?.[0] ?? null;
      setLab(row);
      setName(row?.name || "");
      setCityCode(row?.city_code || "");
      setLabCode(row?.lab_code || "");
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
        value: lab.plan_name || "—",
      },
      {
        key: "cityCode",
        icon: LocationCityOutlinedIcon,
        label: t("pages.myLaboratory.fields.cityCode"),
        value: lab.city_code || "—",
      },
      {
        key: "labCode",
        icon: TagOutlinedIcon,
        label: t("pages.myLaboratory.fields.labCode"),
        value: lab.lab_code || "—",
      },
      {
        key: "users",
        icon: GroupOutlinedIcon,
        label: t("pages.myLaboratory.fields.users"),
        value: lab.users_usage ?? lab.users_count ?? "—",
      },
      {
        key: "owner",
        icon: BadgeOutlinedIcon,
        label: t("pages.myLaboratory.fields.owner"),
        value: lab.owner_name || "—",
      },
      {
        key: "ownerEmail",
        icon: EmailOutlinedIcon,
        label: t("pages.myLaboratory.fields.ownerEmail"),
        value: lab.owner_email || "—",
      },
    ];
  }, [lab, t]);

  const handleSave = async () => {
    if (!lab?.id) return;
    setSaving(true);
    try {
      const { data } = await client.patch(`/laboratories/${lab.id}/`, {
        name: name.trim(),
        city_code: cityCode.trim().toUpperCase(),
        lab_code: labCode.trim().toUpperCase(),
      });
      setLab(data);
      setOpen(false);
      toast.success(t("toast.updated"));
    } catch (error) {
      toast.error(getErrorMessage(error, t("toast.saveFailed")));
    } finally {
      setSaving(false);
    }
  };

  const openEdit = () => {
    setName(lab.name || "");
    setCityCode(lab.city_code || "");
    setLabCode(lab.lab_code || "");
    setOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <PageHeader
        title={t("pages.myLaboratory.title")}
        subtitle={t("pages.myLaboratory.subtitle")}
        action={
          <TableRefreshButton onRefresh={() => fetchLab(true)} refreshing={refreshing} />
        }
      />

      {loading ? (
        <FormCardSkeleton fields={4} />
      ) : lab ? (
        <Paper elevation={0} sx={pageSectionPaperSx}>
          <Box
            sx={{
              position: "relative",
              px: { xs: 2, sm: 2.75 },
              py: { xs: 2.25, sm: 2.75 },
              overflow: "hidden",
              background: isLight
                ? `linear-gradient(135deg, ${alpha(primary, 0.14)} 0%, ${alpha(primary, 0.05)} 48%, ${alpha(theme.palette.secondary.main, 0.06)} 100%)`
                : `linear-gradient(135deg, ${alpha(primary, 0.28)} 0%, ${alpha(primary, 0.12)} 55%, ${alpha("#000", 0.2)} 100%)`,
              borderBottom: 1,
              borderColor: "divider",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 70% 90% at 100% 0%, ${alpha(primary, isLight ? 0.16 : 0.22)} 0%, transparent 60%)`,
                pointerEvents: "none",
              },
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2.5}
              alignItems={{ xs: "center", sm: "center" }}
              sx={{ position: "relative" }}
            >
              <LabLogoPreview logoUrl={logoUrl} />

              <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", sm: "left" } }}>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    lineHeight: 1.15,
                    fontSize: { xs: "1.55rem", sm: "1.85rem" },
                    letterSpacing: -0.3,
                  }}
                >
                  {lab.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.75, maxWidth: 480, mx: { xs: "auto", sm: 0 } }}
                >
                  {t("pages.myLaboratory.detailsSubtitle")}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                  sx={{ mt: 1.5 }}
                >
                  {lab.plan_name ? (
                    <Chip
                      size="small"
                      icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: "16px !important" }} />}
                      label={lab.plan_name}
                      sx={{
                        fontWeight: 700,
                        bgcolor: alpha(primary, isLight ? 0.14 : 0.22),
                        color: "primary.main",
                        border: "none",
                      }}
                    />
                  ) : null}
                  {lab.city_code || lab.lab_code ? (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={[lab.city_code, lab.lab_code].filter(Boolean).join(" · ")}
                      sx={{
                        fontWeight: 700,
                        borderColor: alpha(primary, 0.28),
                        bgcolor: alpha(theme.palette.background.paper, isLight ? 0.65 : 0.25),
                      }}
                    />
                  ) : null}
                </Stack>
              </Box>

              {isLabOwner ? (
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<EditOutlinedIcon />}
                  onClick={openEdit}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 999,
                    flexShrink: 0,
                    px: 2.25,
                    boxShadow: `0 8px 20px ${alpha(primary, 0.28)}`,
                  }}
                >
                  {t("common.edit")}
                </Button>
              ) : null}
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.25,
              }}
            >
              {metaItems.map((item) => (
                <MetaTile
                  key={item.key}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper elevation={0} sx={pageSectionPaperSx}>
          <Box
            sx={{
              px: { xs: 2.5, sm: 4 },
              py: { xs: 4, sm: 5.5 },
              textAlign: "center",
              background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${alpha(primary, isLight ? 0.1 : 0.18)} 0%, transparent 70%)`,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                mx: "auto",
                mb: 2,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(primary, 0.12),
                color: "primary.main",
              }}
            >
              <ScienceOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.2 }}>
              {t("pages.myLaboratory.emptyTitle")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75, maxWidth: 420, mx: "auto", lineHeight: 1.55 }}
            >
              {t("pages.myLaboratory.emptySubtitle")}
            </Typography>
            <Chip
              size="small"
              label={t("pages.myLaboratory.emptyHint")}
              sx={{ mt: 2, fontWeight: 600 }}
            />
          </Box>
        </Paper>
      )}

      {isLabOwner ? <LaboratoryBrandSection /> : null}

      <ResponsiveDialog open={open} onClose={() => !saving && setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t("pages.myLaboratory.editTitle")}</DialogTitle>
        <DialogContent sx={dialogFormContentSx}>
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
          <FormField
            id="lab-city-code"
            label={t("pages.myLaboratory.fields.cityCode")}
            required
            helperText="Used in Case ID prefix (e.g. YGN/PWA/2026/…). Unique with lab code."
          >
            <ProTextField
              id="field-lab-city-code"
              labelPlacement="top"
              fullWidth
              required
              value={cityCode}
              onChange={(e) => setCityCode(e.target.value)}
              placeholder="YGN"
            />
          </FormField>
          <FormField id="lab-lab-code" label={t("pages.myLaboratory.fields.labCode")} required>
            <ProTextField
              id="field-lab-lab-code"
              labelPlacement="top"
              fullWidth
              required
              value={labCode}
              onChange={(e) => setLabCode(e.target.value)}
              placeholder="PWA"
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
            confirmDisabled={!name.trim() || !cityCode.trim() || !labCode.trim()}
          />
        </DialogActions>
      </ResponsiveDialog>
    </Box>
  );
}
