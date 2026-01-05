import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

type NumberFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export function NumberField<T extends FieldValues>({
  control,
  name,
  label = "數量",
  placeholder,
  min,
  max,
  disabled,
}: NumberFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            type="number"
            id={field.name}
            value={field.value ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              field.onChange(val === "" ? 0 : parseInt(val, 10));
            }}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            min={min}
            max={max}
            disabled={disabled}
          />
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
