import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getSetting } from "@/services/setting";
import { useSuspenseQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { VList } from "virtua";

type AttendeeFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  buttonPlaceholer?: string;
  inputPlaceholder?: string;
};

export function AttendeeField<T extends FieldValues>({
  name,
  control,
  label = "人員",
  buttonPlaceholer = "請輸入人員",
  inputPlaceholder = "請輸入人員...",
}: AttendeeFieldProps<T>) {
  const { data: setting } = useSuspenseQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });
  const { userKeys } = setting;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: userField, fieldState }) => {
        const [open, setOpen] = useState<boolean>(false);
        const onClear = () => {
          setOpen(false);
          userField.onChange("");
        };

        return (
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="flex flex-col gap-1.5">
                  <Label>{label}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", !userField.value && "text-muted-foreground")}
                  >
                    {userKeys.find((u) => u.id === userField.value)?.displayName || buttonPlaceholer}
                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width]! p-0" align="start">
                <Command
                  filter={(value, search) => {
                    const name = userKeys.find((u) => u.id === value)?.displayName;
                    if (name?.includes(search)) return 1;
                    return 0;
                  }}
                  className="**:[[cmdk-group]]:max-h-50 **:[[cmdk-group]]:overflow-y-auto"
                >
                  <CommandInput placeholder={inputPlaceholder} />
                  <VList style={{ height: 180 }}>
                    <CommandEmpty>找不到成員</CommandEmpty>
                    <CommandGroup>
                      <CommandItem value="" onSelect={onClear}>
                        不指定同伴
                      </CommandItem>
                      {userKeys.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.id}
                          onSelect={(value) => {
                            const selectedUser = userKeys.find((user) => user.id === value)?.id;
                            userField.onChange(selectedUser);
                            setOpen(false);
                          }}
                        >
                          {user.displayName}
                          <Check
                            className={clsx(
                              "ml-auto size-4",
                              userField.value?.id === user.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </VList>
                </Command>
              </PopoverContent>
            </Popover>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </div>
        );
      }}
    />
  );
}
