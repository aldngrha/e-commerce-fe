import { useForm } from "react-hook-form";
import FormInput from "../FormInput/FormInput.tsx";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuthClient } from "../../api/grpc/client.ts";
import Swal from "sweetalert2";
import { useGrpcApi } from "../../hooks/useGrpcApi.tsx";

const changePasswordSchema = yup.object().shape({
  current_password: yup.string().required("Current password is required"),
  new_password: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm_new_password: yup
    .string()
    .required("Confirm new password is required")
    .min(6, "Password must be at least 6 characters")
    .oneOf([yup.ref("new_password")], "Passwords must match"),
});

interface ChangePasswordSectionProps extends Record<string, unknown> {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

function ChangePasswordSection() {
  const form = useForm<ChangePasswordSectionProps>({
    resolver: yupResolver(changePasswordSchema),
  });
  const { isLoading, callApi } = useGrpcApi();

  const submitHandler = async (values: ChangePasswordSectionProps) => {
    await callApi(
      getAuthClient().changePassword({
        oldPassword: values.current_password,
        newPassword: values.new_password,
        confirmNewPassword: values.confirm_new_password,
      }),
      {
        defaultError: (res) => {
          if (res.response.base?.message === "Old password is not matched") {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Old password is not match",
            });
          }
        },
        useDefaultError: false,
      },
    );

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Successfully",
    });

    form.reset();
    return;
  };

  return (
    <div className="p-4 p-lg-5 border bg-white">
      <h2 className="h3 mb-3 text-black">Ubah Kata Sandi</h2>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <FormInput<ChangePasswordSectionProps>
          type="password"
          register={form.register}
          name="current_password"
          errors={form.formState.errors}
          label="Current password"
          disabled={isLoading}
        />
        <FormInput<ChangePasswordSectionProps>
          type="password"
          register={form.register}
          name="new_password"
          label="New password"
          disabled={isLoading}
          errors={form.formState.errors}
        />
        <FormInput<ChangePasswordSectionProps>
          type="password"
          disabled={isLoading}
          label="Confirm new password"
          register={form.register}
          name="confirm_new_password"
          errors={form.formState.errors}
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Loading ..." : "Perbarui Kata Sandi"}
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordSection;
