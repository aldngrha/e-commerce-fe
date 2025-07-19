import Navbar from "../../components/Navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.ts";
import { useEffect } from "react";

function AuthLayout() {
  const isLoggin = useAuthStore((state) => state.isLoggedIn);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggin) {
      navigate("/");
    }
  }, [isLoggin, navigate]);

  return (
    <>
      <Navbar />

      <Outlet />
    </>
  );
}

export default AuthLayout;
