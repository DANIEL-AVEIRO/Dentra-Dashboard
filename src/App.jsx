import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "@/components/common/ScrollToTop";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import AdminLayoutSkeleton from "@/components/common/skeletons/AdminLayoutSkeleton";
import { LanguageProvider } from "@/context/LanguageContext";
import { BrandProvider } from "@/context/BrandContext";
import { AppThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LockScreenProvider } from "@/context/LockScreenContext";
import { LoadingProvider } from "@/context/LoadingProvider";
import ToastProvider from "@/components/common/ToastProvider";
import Layout from "@/components/Layout";
import UsersPage from "@/pages/users/UsersPage";
import AdminPage from "@/pages/AdminPage";
import ProfilePage from "@/pages/ProfilePage";
import RolesPage from "@/pages/system/RolesPage";
import PlansPage from "@/pages/plans/PlansPage";
import LaboratoriesPage from "@/pages/laboratories/LaboratoriesPage";
import MyLaboratoryPage from "@/pages/laboratories/MyLaboratoryPage";
import LabUsersPage from "@/pages/laboratories/LabUsersPage";
import ClinicsPage from "@/pages/laboratories/ClinicsPage";
import DentistsPage from "@/pages/laboratories/DentistsPage";
import StorageAnalysisPage from "@/pages/laboratories/StorageAnalysisPage";
import MaterialsPage from "@/pages/operations/MaterialsPage";
import MaterialCategoriesPage from "@/pages/operations/MaterialCategoriesPage";
import RestorationsPage from "@/pages/operations/RestorationsPage";
import RestorationCategoriesPage from "@/pages/operations/RestorationCategoriesPage";
import ShadesPage from "@/pages/operations/ShadesPage";
import MaterialSizesPage from "@/pages/operations/MaterialSizesPage";
import PriceListPage from "@/pages/operations/PriceListPage";
import CasesPage from "@/pages/operations/CasesPage";
import CaseFormPage from "@/pages/operations/CaseFormPage";
import FabricationPage from "@/pages/operations/FabricationPage";
import QcPage from "@/pages/operations/QcPage";
import CommissionsPage from "@/pages/operations/CommissionsPage";
import CommissionRulesPage from "@/pages/operations/CommissionRulesPage";
import DeliveriesPage from "@/pages/operations/DeliveriesPage";
import BillingPage from "@/pages/operations/BillingPage";
import CollectionsPage from "@/pages/operations/CollectionsPage";
import ClinicStatementsPage from "@/pages/operations/ClinicStatementsPage";
import ExpensesPage from "@/pages/operations/ExpensesPage";
import ReportsPage from "@/pages/operations/ReportsPage";
import PatientsPage from "@/pages/clinic/PatientsPage";
import AppointmentsPage from "@/pages/clinic/AppointmentsPage";
import RxTemplatesPage from "@/pages/clinic/RxTemplatesPage";
import ClinicUsersPage from "@/pages/clinic/ClinicUsersPage";
import AuditLogsPage from "@/pages/system/AuditLogsPage";
import TrashPage from "@/pages/system/TrashPage";
import SettingsPage from "@/pages/system/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginRoute from "@/pages/LoginRoute";
import { LOGIN_PATH, LOGIN_ROUTE } from "@/config/authPaths";
import PermissionRoute from "@/components/common/PermissionRoute";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <AdminLayoutSkeleton />;
  }
  if (!user) {
    return <NotFoundPage />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Absolute + relative so /ikjnbhg always matches (env or default). */}
      <Route path={LOGIN_PATH} element={<LoginRoute />} />
      <Route path={LOGIN_ROUTE} element={<LoginRoute />} />
      <Route path="login" element={<NotFoundPage />} />
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/admin" replace />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="laboratories" element={<LaboratoriesPage />} />
        <Route path="storage-analysis" element={<StorageAnalysisPage />} />
        <Route path="my-laboratory" element={<MyLaboratoryPage />} />
        <Route
          path="lab-users"
          element={
            <PermissionRoute labOwnerOnly>
              <LabUsersPage />
            </PermissionRoute>
          }
        />
        <Route
          path="clinic-users"
          element={
            <PermissionRoute labOwnerOnly>
              <ClinicUsersPage />
            </PermissionRoute>
          }
        />
        <Route path="clinics" element={<ClinicsPage />} />
        <Route path="dentists" element={<DentistsPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="rx-templates" element={<RxTemplatesPage />} />
        <Route path="material-categories" element={<MaterialCategoriesPage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="restoration-categories" element={<RestorationCategoriesPage />} />
        <Route path="restorations" element={<RestorationsPage />} />
        <Route path="shades" element={<ShadesPage />} />
        <Route path="material-sizes" element={<MaterialSizesPage />} />
        <Route path="price-list" element={<PriceListPage />} />
        <Route path="cases/new" element={<CaseFormPage />} />
        <Route path="cases/:id/edit" element={<CaseFormPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="fabrication" element={<FabricationPage />} />
        <Route path="qc" element={<QcPage />} />
        <Route path="deliveries" element={<DeliveriesPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="clinic-statements" element={<ClinicStatementsPage />} />
        <Route path="commissions" element={<CommissionsPage />} />
        <Route path="commission-rules" element={<CommissionRulesPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route
          path="settings"
          element={
            <PermissionRoute permission="is_staff">
              <SettingsPage />
            </PermissionRoute>
          }
        />
        <Route path="site-settings" element={<Navigate to="/settings" replace />} />
        <Route path="clear-cache" element={<Navigate to="/settings" replace />} />
        <Route
          path="audit-logs"
          element={
            <PermissionRoute staffOrLabOwner>
              <AuditLogsPage />
            </PermissionRoute>
          }
        />
        <Route
          path="trash"
          element={
            <PermissionRoute permission="is_staff">
              <TrashPage />
            </PermissionRoute>
          }
        />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrandProvider>
          <AppThemeProvider>
            <LoadingProvider>
              <ToastProvider>
                <LockScreenProvider>
                  <BrowserRouter>
                    <ScrollToTop />
                    <ErrorBoundary>
                      <AppRoutes />
                    </ErrorBoundary>
                  </BrowserRouter>
                </LockScreenProvider>
              </ToastProvider>
            </LoadingProvider>
          </AppThemeProvider>
        </BrandProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
