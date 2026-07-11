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
import PriceListPage from "@/pages/operations/PriceListPage";
import CasesPage from "@/pages/operations/CasesPage";
import CaseFormPage from "@/pages/operations/CaseFormPage";
import FabricationPage from "@/pages/operations/FabricationPage";
import DeliveriesPage from "@/pages/operations/DeliveriesPage";
import AuditLogsPage from "@/pages/system/AuditLogsPage";
import TrashPage from "@/pages/system/TrashPage";
import SettingsPage from "@/pages/system/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginRoute from "@/pages/LoginRoute";
import { LOGIN_ROUTE } from "@/config/authPaths";
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
        <Route path="clinics" element={<ClinicsPage />} />
        <Route path="dentists" element={<DentistsPage />} />
        <Route path="material-categories" element={<MaterialCategoriesPage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="restoration-categories" element={<RestorationCategoriesPage />} />
        <Route path="restorations" element={<RestorationsPage />} />
        <Route path="price-list" element={<PriceListPage />} />
        <Route path="cases/new" element={<CaseFormPage />} />
        <Route path="cases/:id/edit" element={<CaseFormPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="fabrication" element={<FabricationPage />} />
        <Route path="deliveries" element={<DeliveriesPage />} />
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
            <PermissionRoute permission="is_staff">
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
