import { Chip, Typography } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import InfoDetailCard, { InfoMetaList } from "@/components/common/InfoMetaPanel";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import { useTranslation } from "@/context/LanguageContext";

function LabUserInfoCard({ row, actions }) {
  const { t } = useTranslation();
  const active = Boolean(row.is_active);

  return (
    <InfoDetailCard
      icon={PersonOutlinedIcon}
      title={row.username || "—"}
      subtitle={row.email || undefined}
      action={actions}
    >
      <InfoMetaList
        items={[
          {
            key: "email",
            icon: EmailOutlinedIcon,
            label: t("fields.email"),
            value: (
              <Typography variant="body2" fontWeight={600} sx={{ wordBreak: "break-word" }}>
                {row.email || "—"}
              </Typography>
            ),
          },
          {
            key: "phone",
            icon: PhoneOutlinedIcon,
            label: t("fields.phone"),
            value: (
              <Typography variant="body2" fontWeight={600}>
                {row.phone || "—"}
              </Typography>
            ),
          },
          {
            key: "status",
            icon: PersonOutlinedIcon,
            label: t("fields.status", { defaultValue: "Status" }),
            value: (
              <Chip
                size="small"
                color={active ? "success" : "default"}
                label={active ? t("common.active", { defaultValue: "Active" }) : t("common.inactive", { defaultValue: "Inactive" })}
                sx={{ fontWeight: 600 }}
              />
            ),
          },
        ]}
      />
    </InfoDetailCard>
  );
}

export default function LabUsersPage() {
  return (
    <ResourceListPage
      endpoint="users"
      pageKey="labUsers"
      listParams={{ lab_users: "1" }}
      title="Lab Users"
      subtitle="Create and manage user accounts for your laboratory"
      searchPlaceholder="Search lab users…"
      layout="cards"
      columns={[
        { key: "username", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        {
          key: "is_active",
          label: "Status",
          type: "boolean",
          trueLabel: "Active",
          falseLabel: "Inactive",
        },
      ]}
      fields={[
        { name: "username", label: "Name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone" },
        {
          name: "password",
          label: "Password",
          type: "password",
          requiredOnCreate: true,
          helperText: "Minimum 6 characters",
        },
        {
          name: "is_active",
          label: "Account active",
          type: "boolean",
          default: true,
          activeLabel: "Active",
          inactiveLabel: "Inactive",
        },
      ]}
      renderCard={(row, ctx) => (
        <LabUserInfoCard row={row} actions={ctx.actions} />
      )}
    />
  );
}
