import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { DatePicker } from "../ui/datePicker";
import { Field, FieldError, FieldLabel } from "../ui/field";

type DateFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  onDateChange?: (date: string | undefined) => void;
  disabled?: boolean;
};

export function DateField<T extends FieldValues>({
  control,
  name,
  label = "日期",
  onDateChange,
  disabled,
}: DateFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <DatePicker
            date={field.value}
            onDateChange={(date) => {
              field.onChange(date);
              onDateChange?.(date);
            }}
            id={field.name}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
          />
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
