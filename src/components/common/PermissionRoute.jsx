import { Navigate } from "react-router-dom";
import AdminLayoutSkeleton from "@/components/common/skeletons/AdminLayoutSkeleton";
import NotFoundPage from "@/pages/NotFoundPage";
import { useAuth } from "@/context/AuthContext";
import { can } from "@/utils/permissions";

/**
 * Route guard — redirects home when the user lacks a permission codename.
 */
export default function PermissionRoute({ permission, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <AdminLayoutSkeleton />;
  }

  if (!user) {
    return <NotFoundPage />;
  }

  if (!can(user, permission)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
