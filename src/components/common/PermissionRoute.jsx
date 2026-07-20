import AdminLayoutSkeleton from "@/components/common/skeletons/AdminLayoutSkeleton";
import NotFoundPage from "@/pages/NotFoundPage";
import { useAuth } from "@/context/AuthContext";
import { can, isLabOwner, isPlatformStaff } from "@/utils/permissions";

/**
 * Route guard — unknown/unauthorized paths stay on 404 (no redirect to /admin).
 */
export default function PermissionRoute({
  permission,
  labOwnerOnly,
  staffOrLabOwner,
  children,
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <AdminLayoutSkeleton />;
  }

  if (!user) {
    return <NotFoundPage />;
  }

  if (labOwnerOnly && !isLabOwner(user)) {
    return <NotFoundPage />;
  }

  if (staffOrLabOwner) {
    if (isPlatformStaff(user) || isLabOwner(user)) {
      return children;
    }
    return <NotFoundPage />;
  }

  if (!can(user, permission)) {
    return <NotFoundPage />;
  }

  return children;
}
