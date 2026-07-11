import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import CardMembershipOutlinedIcon from "@mui/icons-material/CardMembershipOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

/**
 * Sidebar navigation grouped by module.
 * Platform: overview → laboratories → access → system
 * Lab: overview → operations → partners → catalog → pricing → myLab
 */
export const navSections = [
  {
    id: "overview",
    titleKey: "nav.sections.overview",
    platformOnly: true,
    labOwnerOnly: true,
    items: [{ path: "/admin", labelKey: "nav.admin", icon: HomeOutlinedIcon }],
  },
  {
    id: "laboratories",
    titleKey: "nav.sections.laboratories",
    platformOnly: true,
    items: [
      { path: "/plans", labelKey: "nav.plans", icon: CardMembershipOutlinedIcon },
      {
        path: "/laboratories",
        labelKey: "nav.laboratories",
        icon: ScienceOutlinedIcon,
      },
      {
        path: "/storage-analysis",
        labelKey: "nav.storageAnalysis",
        icon: StorageOutlinedIcon,
      },
    ],
  },
  {
    id: "operations",
    titleKey: "nav.sections.operations",
    labOnly: true,
    items: [
      { path: "/cases", labelKey: "nav.cases", icon: AssignmentOutlinedIcon },
      {
        path: "/fabrication",
        labelKey: "nav.fabrication",
        icon: PrecisionManufacturingOutlinedIcon,
      },
      {
        path: "/deliveries",
        labelKey: "nav.deliveries",
        icon: LocalShippingOutlinedIcon,
      },
    ],
  },
  {
    id: "partners",
    titleKey: "nav.sections.partners",
    labOnly: true,
    items: [
      {
        path: "/clinics",
        labelKey: "nav.clinics",
        icon: LocalHospitalOutlinedIcon,
      },
      {
        path: "/dentists",
        labelKey: "nav.dentists",
        icon: MedicalServicesOutlinedIcon,
      },
    ],
  },
  {
    id: "catalog",
    titleKey: "nav.sections.catalog",
    labOnly: true,
    items: [
      {
        path: "/restoration-categories",
        labelKey: "nav.restorationCategories",
        icon: StyleOutlinedIcon,
      },
      {
        path: "/restorations",
        labelKey: "nav.restorations",
        icon: BuildOutlinedIcon,
      },
      {
        path: "/material-categories",
        labelKey: "nav.materialCategories",
        icon: LayersOutlinedIcon,
      },
      {
        path: "/materials",
        labelKey: "nav.materials",
        icon: CategoryOutlinedIcon,
      },
    ],
  },
  {
    id: "pricing",
    titleKey: "nav.sections.pricing",
    labOnly: true,
    items: [
      {
        path: "/price-list",
        labelKey: "nav.priceList",
        icon: AttachMoneyOutlinedIcon,
      },
    ],
  },
  {
    id: "myLab",
    titleKey: "nav.sections.myLab",
    labOnly: true,
    items: [
      {
        path: "/my-laboratory",
        labelKey: "nav.myLaboratory",
        icon: ScienceOutlinedIcon,
      },
      {
        path: "/lab-users",
        labelKey: "nav.labUsers",
        icon: GroupOutlinedIcon,
        labOwnerOnly: true,
      },
      {
        path: "/storage-analysis",
        labelKey: "nav.storageAnalysis",
        icon: StorageOutlinedIcon,
      },
    ],
  },
  {
    id: "access",
    titleKey: "nav.sections.access",
    platformOnly: true,
    items: [
      { path: "/users", labelKey: "nav.users", icon: ManageAccountsIcon },
      { path: "/roles", labelKey: "nav.roles", icon: AdminPanelSettingsIcon },
    ],
  },
  {
    id: "system",
    titleKey: "nav.sections.system",
    platformOnly: true,
    items: [
      { path: "/settings", labelKey: "nav.settings", icon: SettingsIcon },
      { path: "/audit-logs", labelKey: "nav.auditLogs", icon: FactCheckIcon },
      { path: "/trash", labelKey: "nav.trash", icon: DeleteOutlineIcon },
    ],
  },
];

export const flatNav = navSections.flatMap((s) => s.items);
