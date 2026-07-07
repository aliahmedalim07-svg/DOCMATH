import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { dashboardPathForAccess, hasAdminRole } from "../lib/utils";
import { AccountType } from "../lib/types";
import { MascotLoader } from "./MascotLoader";

interface ProtectedRouteProps {
  role?: "student" | "parent" | "admin" | Array<"student" | "parent" | "admin">;
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, roles, loading } = useAuth();
  const location = useLocation();

  if (loading) return <MascotLoader />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const accessRoles: Array<"student" | "parent" | "admin"> = [];
  if (user.accountType === AccountType.Student) accessRoles.push("student");
  if (user.accountType === AccountType.Parent) accessRoles.push("parent");
  if (hasAdminRole(roles)) accessRoles.push("admin");

  const allowedRoles = Array.isArray(role) ? role : role ? [role] : null;
  if (allowedRoles && !allowedRoles.some((allowed) => accessRoles.includes(allowed))) {
    return <Navigate to={dashboardPathForAccess(user.accountType, roles)} replace />;
  }

  return <Outlet />;
}
