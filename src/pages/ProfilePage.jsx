import { useEffect, useMemo, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { formatDisplayDate } from "@/utils/dateTimeValue";
import ActionButton from "@/components/common/ActionButton";
import { FormField, ProTextField } from "@/components/common/form";
import ImageField from "@/components/common/ImageField";
import PageHeader from "@/components/common/PageHeader";
import { FormCardSkeleton } from "@/components/common/skeletons";
import { FORM_GAP } from "@/constants/layout";
import { formGridContainerSx } from "@/components/common/form/formLayout";
import {
  pageSectionHeaderSx,
  pageSectionPaperSx,
  pageShellSx,
} from "@/constants/pageLayout";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { userRoleLabel } from "@/utils/roleDisplay";
import { resolveMediaUrl } from "@/utils/mediaUrl";

function profileFormFromUser(user) {
  return {
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    current_password: "",
    new_password: "",
    profile: null,
  };
}

function ProfileSection({ icon: Icon, title, subtitle, children }) {
  return (
    <Paper elevation={0} sx={pageSectionPaperSx}>
      <Box sx={pageSectionHeaderSx}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{ minWidth: 0 }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        </Stack>
      </Box>
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>{children}</Box>
    </Paper>
  );
}

function ProfileMetaRow({ icon: Icon, label, value, showDivider = false }) {
  return (
    <>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          px: 1.5,
          py: 1.25,
          minHeight: 52,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
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
            lineHeight={1.2}
            display="block"
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ wordBreak: "break-word", lineHeight: 1.35, mt: 0.15 }}
          >
            {value || "—"}
          </Typography>
        </Box>
      </Stack>
      {showDivider ? <Divider sx={{ mx: 1.5 }} /> : null}
    </>
  );
}

function ProfileMetaList({ items }) {
  if (!items.length) return null;

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {items.map((item, index) => (
        <ProfileMetaRow
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          showDivider={index < items.length - 1}
        />
      ))}
    </Box>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(() => profileFormFromUser(user));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(profileFormFromUser(user));
    }
  }, [user]);

  const baseline = useMemo(() => profileFormFromUser(user), [user]);

  const isDirty = useMemo(() => {
    if (!user) return false;
    if (form.profile instanceof File) return true;
    if (form.username !== baseline.username) return true;
    if (form.email !== baseline.email) return true;
    if (form.phone !== baseline.phone) return true;
    if (form.new_password || form.current_password) return true;
    return false;
  }, [form, baseline, user]);

  const roleLabel = userRoleLabel(user) || t("pages.profile.staff");
  const memberSince = user?.created_at
    ? formatDisplayDate(user.created_at)
    : null;

  const profileMetaItems = useMemo(() => {
    if (!user) return [];
    const items = [
      {
        icon: EmailOutlinedIcon,
        label: t("fields.email"),
        value: user.email,
      },
      {
        icon: PhoneOutlinedIcon,
        label: t("fields.phone"),
        value: user.phone,
      },
    ];
    if (memberSince) {
      items.push({
        icon: PersonOutlinedIcon,
        label: t("pages.profile.memberSince", { defaultValue: "Member since" }),
        value: memberSince,
      });
    }
    return items;
  }, [user, memberSince, t]);

  const handleReset = () => {
    if (user) setForm(profileFormFromUser(user));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.new_password && !form.current_password) {
      toast.error(t("pages.profile.currentPasswordRequired"));
      return;
    }

    setSaving(true);
    try {
      const hasProfileFile = form.profile instanceof File;
      let data;

      if (hasProfileFile) {
        const fd = new FormData();
        fd.append("username", form.username);
        fd.append("email", form.email);
        if (form.phone) fd.append("phone", form.phone);
        if (form.new_password) {
          fd.append("current_password", form.current_password);
          fd.append("new_password", form.new_password);
        }
        fd.append("profile", form.profile);
        ({ data } = await client.patch("/auth/me/", fd));
      } else {
        const payload = {
          username: form.username,
          email: form.email,
          phone: form.phone,
        };
        if (form.new_password) {
          payload.current_password = form.current_password;
          payload.new_password = form.new_password;
        }
        ({ data } = await client.patch("/auth/me/", payload));
      }

      setUser?.(data);
      setForm((prev) => ({
        ...profileFormFromUser(data),
        profile: null,
      }));
      toast.success(t("toast.profileUpdated"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.profileFailed")));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={pageShellSx}>
      <PageHeader
        title={t("pages.profile.title")}
        subtitle={t("pages.profile.subtitle")}
      />

      {!user ? (
        <FormCardSkeleton fields={4} showAvatar />
      ) : (
        <Box
          component="form"
          onSubmit={handleSave}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  ...pageSectionPaperSx,
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    px: { xs: 2, sm: 2.5 },
                    pt: { xs: 2.5, sm: 3 },
                    pb: 2,
                    background: (theme) =>
                      theme.palette.mode === "light"
                        ? `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${alpha(theme.palette.secondary.main, 0.06)} 55%, transparent 100%)`
                        : `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.35)} 0%, ${alpha(theme.palette.secondary.main, 0.12)} 60%, transparent 100%)`,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Stack alignItems="center" spacing={2} textAlign="center">
                    <Box
                      sx={{
                        p: 0.5,
                        borderRadius: "50%",
                        bgcolor: "background.paper",
                        boxShadow: (theme) =>
                          `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
                      }}
                    >
                      <ImageField
                        showLabel={false}
                        hideAvatarHint
                        variant="avatar"
                        avatarSize="large"
                        value={form.profile}
                        previewUrl={resolveMediaUrl(user?.profile)}
                        onChange={(file) => setForm({ ...form, profile: file })}
                        accept="image/*"
                        resizePreset="avatar"
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        lineHeight={1.25}
                      >
                        {user.username}
                      </Typography>
                      <Chip
                        size="small"
                        label={roleLabel}
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 1, fontWeight: 600 }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("pages.profile.photoHint")}
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ p: { xs: 2, sm: 2.5 }, flex: 1 }}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    fontWeight={700}
                    sx={{ display: "block", mb: 1.25, letterSpacing: "0.06em" }}
                  >
                    {t("pages.profile.contactSection", {
                      defaultValue: "Contact",
                    })}
                  </Typography>
                  <ProfileMetaList items={profileMetaItems} />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={8}>
              <Stack spacing={2} sx={{ height: "100%" }}>
                <ProfileSection
                  icon={PersonOutlinedIcon}
                  title={t("pages.profile.accountSection", {
                    defaultValue: "Account details",
                  })}
                  subtitle={t("pages.profile.accountSectionHint", {
                    defaultValue: "How you appear and how we contact you",
                  })}
                >
                  <Grid container spacing={FORM_GAP} sx={formGridContainerSx}>
                    <Grid item xs={12} md={6}>
                      <FormField id="username" label={t("fields.username")}>
                        <ProTextField
                          id="field-username"
                          labelPlacement="top"
                          fullWidth
                          value={form.username}
                          onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                          }
                        />
                      </FormField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormField id="email" label={t("fields.email")}>
                        <ProTextField
                          id="field-email"
                          labelPlacement="top"
                          fullWidth
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                        />
                      </FormField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormField id="phone" label={t("fields.phone")}>
                        <ProTextField
                          id="field-phone"
                          labelPlacement="top"
                          fullWidth
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                      </FormField>
                    </Grid>
                  </Grid>
                </ProfileSection>

                <ProfileSection
                  icon={LockOutlinedIcon}
                  title={t("pages.profile.securitySection", {
                    defaultValue: "Security",
                  })}
                  subtitle={t("pages.profile.securitySectionHint", {
                    defaultValue: "Update your password when needed",
                  })}
                >
                  <Box
                    sx={{
                      mb: 2,
                      px: 1.5,
                      py: 1.25,
                      borderRadius: 1.5,
                      border: 1,
                      borderColor: (theme) =>
                        alpha(theme.palette.info.main, 0.35),
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("pages.profile.passwordHelp")}
                    </Typography>
                  </Box>
                  <Grid container spacing={FORM_GAP} sx={formGridContainerSx}>
                    <Grid item xs={12} md={6}>
                      <FormField
                        id="current_password"
                        label={t("fields.current_password")}
                        helperText={
                          form.new_password
                            ? t("pages.profile.currentPasswordHelp")
                            : undefined
                        }
                      >
                        <ProTextField
                          id="field-current_password"
                          labelPlacement="top"
                          fullWidth
                          type="password"
                          autoComplete="current-password"
                          value={form.current_password}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              current_password: e.target.value,
                            })
                          }
                        />
                      </FormField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormField
                        id="new_password"
                        label={t("fields.new_password")}
                      >
                        <ProTextField
                          id="field-new_password"
                          labelPlacement="top"
                          fullWidth
                          type="password"
                          autoComplete="new-password"
                          value={form.new_password}
                          onChange={(e) =>
                            setForm({ ...form, new_password: e.target.value })
                          }
                        />
                      </FormField>
                    </Grid>
                  </Grid>
                </ProfileSection>
              </Stack>
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{
              ...pageSectionPaperSx,
              position: { xs: "sticky", sm: "static" },
              bottom: { xs: 8, sm: "auto" },
              zIndex: 1,
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1.5, sm: 2 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 1.5,
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? `0 -4px 24px ${alpha(theme.palette.primary.main, 0.06)}`
                  : "none",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                {t("pages.profile.saveBarTitle", {
                  defaultValue: "Save your changes",
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isDirty
                  ? t("pages.profile.unsavedHint", {
                      defaultValue: "You have unsaved changes",
                    })
                  : t("pages.profile.savedHint", {
                      defaultValue: "All changes are saved",
                    })}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ flexShrink: 0, flexWrap: "wrap" }}
            >
              <ActionButton
                type="submit"
                intent="save"
                size="large"
                disabled={!isDirty || saving}
                loading={saving}
                sx={{ minWidth: { xs: 140, sm: 160 } }}
              >
                {saving ? t("common.saving") : t("pages.profile.save")}
              </ActionButton>
              <Button
                type="button"
                variant="outlined"
                startIcon={<RestartAltOutlinedIcon />}
                onClick={handleReset}
                disabled={!isDirty || saving}
              >
                {t("pages.profile.resetChanges", { defaultValue: "Reset" })}
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
