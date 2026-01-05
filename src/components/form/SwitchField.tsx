import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";
type SwitchFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  disabled?: boolean;
};

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label = "開關",
  description,
  disabled,
}: SwitchFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <Switch
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
          </div>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
