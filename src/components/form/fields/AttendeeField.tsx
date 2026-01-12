import UsersCombobox from "@/components/Combobox/UsersCombobox";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { User } from "@/types/user";
import { XCircleIcon } from "lucide-react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

type AttendeeFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  excludeUserIds?: User["id"][];
  disabledUserIds?: User["id"][];
};

export function AttendeeField<T extends FieldValues>({
  name,
  control,
  label = "人員",
  excludeUserIds = [],
  disabledUserIds = [],
}: AttendeeFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <div className="flex items-end gap-1">
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              <UsersCombobox
                value={field.value}
                onSelect={(value) => {
                  field.onChange(value);
                }}
                excludeUserIds={excludeUserIds}
                disabledUserIds={disabledUserIds}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
            <Button
              type="button"
              disabled={!field.value}
              variant={"ghost"}
              size={"icon"}
              onClick={() => field.onChange("")}
            >
              <XCircleIcon className="text-destructive size-6" />
            </Button>
          </div>
        );
      }}
    />
  );
}
