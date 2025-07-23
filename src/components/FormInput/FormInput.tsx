import { FieldErrors, Path, UseFormRegister } from "react-hook-form";

interface FormInputProps<T extends Record<string, unknown>> {
  type: "text" | "password";
  placeholder?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  label?: string;
}

export default function FormInput<T extends Record<string, unknown>>(
  props: FormInputProps<T>,
) {
  return (
    <div className="form-group mb-4">
      {props.label && (
        <label className="text-black" htmlFor={props.name}>
          {props.label}
        </label>
      )}
      <input
        {...props.register(props.name)}
        type={props.type}
        id={`${props.name}`}
        className={`form-control ${props.errors[props.name] ? "is-invalid" : ""} `}
        placeholder={props.placeholder}
        disabled={props.disabled}
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
