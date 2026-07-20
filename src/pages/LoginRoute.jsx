import AdminLayoutSkeleton from "@/components/common/skeletons/AdminLayoutSkeleton";
import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";

/** Secret sign-in path — always show login (never bounce to / or /admin). */
export default function LoginRoute() {
  const { loading } = useAuth();

  if (loading) {
    return <AdminLayoutSkeleton />;
  }
  return <Login />;
}
