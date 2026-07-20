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
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

/**
 * Sidebar navigation grouped by module.
 * Platform: overview → subscription → laboratories → access → configuration → compliance
 * Lab: cases → production → logistics → partners → restorations → materials → pricing → myLab
 * Clinic: overview → cases → patients → appointments → rx → billing → deliveries
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
    id: "clinicOverview",
    titleKey: "nav.sections.overview",
    clinicOnly: true,
    items: [{ path: "/admin", labelKey: "nav.admin", icon: HomeOutlinedIcon }],
  },
  {
    id: "subscription",
    titleKey: "nav.sections.subscription",
    platformOnly: true,
    items: [
      { path: "/plans", labelKey: "nav.plans", icon: CardMembershipOutlinedIcon },
    ],
  },
  {
    id: "laboratories",
    titleKey: "nav.sections.laboratories",
    platformOnly: true,
    items: [
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
    id: "cases",
    titleKey: "nav.sections.cases",
    labOnly: true,
    items: [
      { path: "/cases", labelKey: "nav.cases", icon: AssignmentOutlinedIcon },
    ],
  },
  {
    id: "clinicCases",
    titleKey: "nav.sections.cases",
    clinicOnly: true,
    items: [
      { path: "/cases", labelKey: "nav.cases", icon: AssignmentOutlinedIcon },
    ],
  },
  {
    id: "production",
    titleKey: "nav.sections.production",
    labOnly: true,
    items: [
      {
        path: "/fabrication",
        labelKey: "nav.fabrication",
        icon: PrecisionManufacturingOutlinedIcon,
      },
      {
        path: "/workboard",
        labelKey: "nav.workboard",
        icon: ViewKanbanOutlinedIcon,
      },
      {
        path: "/qc",
        labelKey: "nav.qc",
        icon: VerifiedOutlinedIcon,
      },
    ],
  },
  {
    id: "logistics",
    titleKey: "nav.sections.logistics",
    labOnly: true,
    items: [
      {
        path: "/deliveries",
        labelKey: "nav.deliveries",
        icon: LocalShippingOutlinedIcon,
      },
    ],
  },
  {
    id: "clinicLogistics",
    titleKey: "nav.sections.logistics",
    clinicOnly: true,
    items: [
      {
        path: "/deliveries",
        labelKey: "nav.deliveries",
        icon: LocalShippingOutlinedIcon,
      },
    ],
  },
  {
    id: "finance",
    titleKey: "nav.sections.finance",
    labOnly: true,
    items: [
      {
        path: "/billing",
        labelKey: "nav.billing",
        icon: ReceiptLongOutlinedIcon,
      },
      {
        path: "/collections",
        labelKey: "nav.collections",
        icon: PaymentsOutlinedIcon,
      },
      {
        path: "/clinic-statements",
        labelKey: "nav.clinicStatements",
        icon: AccountBalanceOutlinedIcon,
      },
      {
        path: "/commissions",
        labelKey: "nav.commissions",
        icon: PercentOutlinedIcon,
      },
      {
        path: "/commission-rules",
        labelKey: "nav.commissionRules",
        icon: PercentOutlinedIcon,
      },
      {
        path: "/expenses",
        labelKey: "nav.expenses",
        icon: RequestQuoteOutlinedIcon,
      },
      {
        path: "/reports",
        labelKey: "nav.reports",
        icon: AssessmentOutlinedIcon,
      },
    ],
  },
  {
    id: "clinicFinance",
    titleKey: "nav.sections.finance",
    clinicOnly: true,
    items: [
      {
        path: "/billing",
        labelKey: "nav.billing",
        icon: ReceiptLongOutlinedIcon,
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
      {
        path: "/patients",
        labelKey: "nav.patients",
        icon: PersonOutlineIcon,
      },
      {
        path: "/appointments",
        labelKey: "nav.appointments",
        icon: EventOutlinedIcon,
      },
      {
        path: "/clinic-users",
        labelKey: "nav.clinicUsers",
        icon: PeopleOutlineIcon,
        labOwnerOnly: true,
      },
    ],
  },
  {
    id: "clinicCare",
    titleKey: "nav.sections.clinicCare",
    clinicOnly: true,
    items: [
      {
        path: "/patients",
        labelKey: "nav.patients",
        icon: PersonOutlineIcon,
      },
      {
        path: "/appointments",
        labelKey: "nav.appointments",
        icon: EventOutlinedIcon,
      },
      {
        path: "/rx-templates",
        labelKey: "nav.rxTemplates",
        icon: DescriptionOutlinedIcon,
      },
    ],
  },
  {
    id: "restorations",
    titleKey: "nav.sections.restorations",
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
    ],
  },
  {
    id: "materials",
    titleKey: "nav.sections.materials",
    labOnly: true,
    items: [
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
      {
        path: "/audit-logs",
        labelKey: "nav.auditLogs",
        icon: FactCheckIcon,
        labOwnerOnly: true,
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
    id: "configuration",
    titleKey: "nav.sections.configuration",
    platformOnly: true,
    items: [
      { path: "/settings", labelKey: "nav.settings", icon: SettingsIcon },
    ],
  },
  {
    id: "compliance",
    titleKey: "nav.sections.compliance",
    platformOnly: true,
    items: [
      { path: "/audit-logs", labelKey: "nav.auditLogs", icon: FactCheckIcon },
      { path: "/trash", labelKey: "nav.trash", icon: DeleteOutlineIcon },
    ],
  },
];

export const flatNav = navSections.flatMap((s) => s.items);
