import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import { useAuthStore } from "../../store/auth.ts";
import { useEffect } from "react";

function AdminLayout() {
  const role = useAuthStore((state) => state.role);
  const isAdmin = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin || role !== "admin") {
      navigate("/");
    }
  }, [navigate, role]);
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <Outlet />
    </div>
  );
}

export default AdminLayout;
