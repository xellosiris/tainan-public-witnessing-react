import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { MultiDatePicker } from "@/components/ui/multiDatePicker";
import { SingleDatePicker } from "@/components/ui/singleDatePicker";

type DateFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  mode?: "single" | "multiple";
  label?: string;
  disabled?: boolean;
};

export function DateField<T extends FieldValues>({
  control,
  name,
  mode = "single",
  label = "日期",
  disabled,
}: DateFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {mode === "single" && (
            <SingleDatePicker
              date={field.value}
              onDateChange={field.onChange}
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
            />
          )}
          {mode === "multiple" && (
            <MultiDatePicker
              dates={field.value}
              onDatesChange={field.onChange}
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
            />
          )}
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
