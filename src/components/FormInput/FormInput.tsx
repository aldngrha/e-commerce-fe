import { FieldErrors, Path, UseFormRegister } from "react-hook-form";

interface FormInputProps<T extends Record<string, unknown>> {
  type: "text" | "password";
  placeholder?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  errors: FieldErrors<T>;
}

export default function FormInput<T extends Record<string, unknown>>(
  props: FormInputProps<T>,
) {
  return (
    <div className="form-group mb-4">
      <input
        {...props.register(props.name)}
        type={props.type}
        className={`form-control ${props.errors[props.name] ? "is-invalid" : ""} `}
        placeholder={props.placeholder}
      />
      <div
        className={`text-danger ${props.errors[props.name] ? "" : "hidden"}`}
      >
        <small>
          {(props.errors[props.name]?.message as string | null) ?? ""}
        </small>
      </div>
    </div>
  );
}
