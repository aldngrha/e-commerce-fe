import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../../components/FormInput/FormInput.tsx";

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
  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const submitHandler = (data: LoginFormValues) => {
    // Handle login logic here
    console.log("Login data:", data);
    // You can call an API to authenticate the user
    // If successful, redirect to the dashboard or home page
    // If failed, show an error message
    Swal.fire({
      title: "Berhasil",
      text: "Anda berhasil masuk!",
      icon: "success",
      confirmButtonText: "OK",
    });
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
