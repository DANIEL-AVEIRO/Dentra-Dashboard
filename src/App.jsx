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
      <BrandProvider>
        <AppThemeProvider>
        <LoadingProvider>
          <ToastProvider>
            <AuthProvider>
              <LockScreenProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <ErrorBoundary>
                    <AppRoutes />
                  </ErrorBoundary>
                </BrowserRouter>
              </LockScreenProvider>
            </AuthProvider>
          </ToastProvider>
        </LoadingProvider>
        </AppThemeProvider>
      </BrandProvider>
    </LanguageProvider>
  );
}
