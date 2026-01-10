import { useSuspenseQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getSetting } from "@/services/setting";
import type { UserKey } from "@/types/user";

type AttendeeFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
};

export function AttendeeField<T extends FieldValues>({
  name,
  control,
  label = "人員",
  placeholder = "請輸入人員...",
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
        const [query, setQuery] = useState<string>("");
        const onClear = () => {
          setQuery("");
          setOpen(false);
          userField.onChange("");
        };
        const filterUsers = useMemo<UserKey[]>(() => {
          if (query) {
            return userKeys.filter((user) => user.displayName.includes(query));
          }
          return [];
        }, [query, userKeys]);

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
                    className={cn(
                      "w-full justify-between",
                      !userField.value && "text-muted-foreground",
                    )}
                  >
                    {userKeys.find((u) => u.id === userField.value)
                      ?.displayName || placeholder}
                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width]! p-0"
                align="start"
              >
                <Command
                  shouldFilter={false}
                  className="**:[[cmdk-group]]:max-h-50 **:[[cmdk-group]]:overflow-y-auto"
                >
                  <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder={placeholder}
                  />
                  {!query && (
                    <CommandGroup>
                      <CommandItem value="" onSelect={onClear}>
                        不指定同伴
                      </CommandItem>
                    </CommandGroup>
                  )}
                  {!!query && (
                    <CommandList style={{ height: 180 }}>
                      <CommandEmpty>找不到成員</CommandEmpty>
                      <CommandGroup>
                        {filterUsers?.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={(value) => {
                              const selectedUser = userKeys.find(
                                (user) => user.id === value,
                              )?.id;
                              userField.onChange(selectedUser);
                              setOpen(false);
                            }}
                          >
                            {user.displayName}
                            <Check
                              className={clsx(
                                "ml-auto size-4",
                                userField.value?.id === user.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  )}
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
