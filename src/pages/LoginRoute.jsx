import { Navigate } from "react-router-dom";
import AdminLayoutSkeleton from "@/components/common/skeletons/AdminLayoutSkeleton";
import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";

/** Sign-in only at the secret path; redirect home when already authenticated. */
export default function LoginRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AdminLayoutSkeleton />;
  }
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <Login />;
}
