import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.ts";
import { useEffect } from "react";

function ECommerceLayout() {
  const role = useAuthStore((state) => state.role);

  const navigate = useNavigate();

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate, role]);

  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}

export default ECommerceLayout;
