import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

type SelectOption = {
  id: string;
  name: string;
};

type SelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  disabled?: boolean;
};

export function SelectField<T extends FieldValues>({
  control,
  name,
  label = "選擇",
  placeholder = "請選擇",
  options = [],
  disabled,
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
