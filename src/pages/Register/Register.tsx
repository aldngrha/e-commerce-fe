import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormInput from "../../components/FormInput/FormInput.tsx";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuthClient } from "../../api/grpc/client.ts";
import Swal from "sweetalert2";
import { useGrpcApi } from "../../hooks/useGrpcApi.tsx";

const registerSchema = yup.object().shape({
  email: yup.string().email("Email is required").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password is required")
    .required("Password is required"),
  full_name: yup.string().required("Full name is required"),
  password_confirmation: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password"), yup.ref("password_confirmation")]),
});

interface IRegisterFormValues extends Record<string, unknown> {
  email: string;
  password: string;
  full_name: string;
  password_confirmation: string;
}

const Register = () => {
  const navigate = useNavigate();
  const form = useForm<IRegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const { callApi, isLoading } = useGrpcApi();

  const submitHandler = async (values: IRegisterFormValues): Promise<void> => {
    await callApi(
      getAuthClient().register({
        email: values.email,
        fullName: values.full_name,
        password: values.password,
        confirmPassword: values.password_confirmation,
      }),
      {
        useDefaultError: false,
        defaultError(res) {
          if (res.response.base?.message === "User already exists") {
            Swal.fire({
              title: "Registrasi Gagal",
              icon: "error",
              text: "User already exists",
              showConfirmButton: true,
              timer: 1500,
            });
          }
        },
      },
    );
    Swal.fire({
      icon: "success",
      title: "Success",
      showConfirmButton: true,
      timer: 1500,
    });

    navigate("/login");
  };

  return (
    <div className="login-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-wrap p-4">
              <h2 className="section-title text-center mb-5">Daftar</h2>
              <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="login-form"
              >
                <FormInput<IRegisterFormValues>
                  type="text"
                  register={form.register}
                  name="full_name"
                  placeholder="input full name"
                  errors={form.formState.errors}
                  disabled={isLoading}
                />
                <FormInput<IRegisterFormValues>
                  type="text"
                  register={form.register}
                  name="email"
                  placeholder="input email"
                  errors={form.formState.errors}
                  disabled={isLoading}
                />
                <FormInput<IRegisterFormValues>
                  type="password"
                  register={form.register}
                  name="password"
                  placeholder="input password"
                  errors={form.formState.errors}
                  disabled={isLoading}
                />
                <FormInput<IRegisterFormValues>
                  type="password"
                  register={form.register}
                  name="password_confirmation"
                  placeholder="input confirm password"
                  errors={form.formState.errors}
                  disabled={isLoading}
                />
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading ..." : "Buat Akun"}
                  </button>
                </div>
                <div className="text-center mt-4">
                  <p>
                    Sudah punya akun?{" "}
                    <Link to="/login" className="text-primary">
                      Masuk di sini
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

export default Register;
