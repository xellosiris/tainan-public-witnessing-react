import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type TextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  disabled?: boolean;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label = "文字",
  placeholder,
  type = "text",
  disabled,
}: TextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            {...field}
            type={type}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            disabled={disabled}
          />
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
