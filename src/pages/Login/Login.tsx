import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../../components/FormInput/FormInput.tsx";
import { RpcError } from "@protobuf-ts/runtime-rpc";
import { getAuthClient } from "../../api/grpc/client.ts";

interface LoginFormValues extends Record<string, unknown> {
  email: string;
  password: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Kata sandi minimal 6 karakter")
    .required("Kata sandi wajib diisi"),
});

const Login = () => {
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const submitHandler = async (data: LoginFormValues) => {
    try {
      const client = getAuthClient();
      const res = await client.login({
        email: data.email,
        password: data.password,
      });

      if (res.response.base?.isError ?? true) {
        Swal.fire({
          title: "Gagal",
          text: "Login gagal",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      localStorage.setItem("accessToken", res.response.accessToken);

      navigate("/");

      Swal.fire({
        title: "Berhasil",
        text: "Anda berhasil masuk!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      if (error instanceof RpcError) {
        console.error(error.code, error.message);
        if (error.code === "UNAUTHENTICATED") {
          Swal.fire({
            title: "Gagal",
            text: "Email atau kata sandi salah",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
      }
      Swal.fire({
        title: "Gagal",
        text: "Login gagal, silakan coba beberapa saat lagi",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="login-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-wrap p-4">
              <h2 className="section-title text-center mb-5">Masuk</h2>
              <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="login-form"
              >
                <FormInput<LoginFormValues>
                  type="text"
                  register={form.register}
                  name="email"
                  placeholder="Alamat Email"
                  errors={form.formState.errors}
                />
                <FormInput<LoginFormValues>
                  type="password"
                  register={form.register}
                  name="password"
                  placeholder="Kata Sandi"
                  errors={form.formState.errors}
                />
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    Masuk
                  </button>
                </div>
                <div className="text-center mt-4">
                  <p>
                    Belum punya akun?{" "}
                    <Link to="/register" className="text-primary">
                      Daftar di sini
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
