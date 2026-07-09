import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import CardMembershipOutlinedIcon from "@mui/icons-material/CardMembershipOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

/**
 * Sidebar navigation grouped by module.
 * Sections: overview → access → system.
 */
export const navSections = [
  {
    id: "overview",
    titleKey: "nav.sections.overview",
    items: [{ path: "/admin", labelKey: "nav.admin", icon: HomeOutlinedIcon }],
  },
  {
    id: "access",
    titleKey: "nav.sections.access",
    items: [
      { path: "/users", labelKey: "nav.users", icon: ManageAccountsIcon },
      { path: "/roles", labelKey: "nav.roles", icon: AdminPanelSettingsIcon },
    ],
  },
  {
    id: "laboratories",
    titleKey: "nav.sections.laboratories",
    items: [
      { path: "/plans", labelKey: "nav.plans", icon: CardMembershipOutlinedIcon },
      {
        path: "/laboratories",
        labelKey: "nav.laboratories",
        icon: ScienceOutlinedIcon,
      },
    ],
  },
  {
    id: "system",
    titleKey: "nav.sections.system",
    items: [
      { path: "/settings", labelKey: "nav.settings", icon: SettingsIcon },
      { path: "/audit-logs", labelKey: "nav.auditLogs", icon: FactCheckIcon },
      { path: "/trash", labelKey: "nav.trash", icon: DeleteOutlineIcon },
    ],
  },
];

export const flatNav = navSections.flatMap((s) => s.items);
