import { DatePicker } from "@/components/ui/datePicker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

type DateFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
};

export function DateField<T extends FieldValues>({ control, name, label = "日期", disabled }: DateFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <DatePicker
            date={field.value}
            onDateChange={field.onChange}
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
