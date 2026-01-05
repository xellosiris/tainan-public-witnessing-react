import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type TimeFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function TimeField<T extends FieldValues>({
  control,
  name,
  label = "時間",
  placeholder = "請選擇時間",
  disabled,
}: TimeFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            {...field}
            type="time"
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
