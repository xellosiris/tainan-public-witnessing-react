import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getSetting } from "@/services/setting";
import type { User, UserKey } from "@/types/user";
import { useSuspenseQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { VList } from "virtua";

type Props = {
  value?: UserKey | User["id"];
  onSelect: (userId: User["id"]) => void;
  valueAsUser?: boolean;
  excludeUserIds?: User["id"][];
  disabledUserIds?: User["id"][];
};

export default function UsersCombobox({ value, onSelect, valueAsUser = true, excludeUserIds, disabledUserIds }: Props) {
  const [open, setOpen] = useState(false);

  const { data: setting } = useSuspenseQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });

  const { userKeys } = setting;
  const excludeSet = useMemo(() => new Set(excludeUserIds ?? []), [excludeUserIds]);
  const disabledSet = useMemo(() => new Set(disabledUserIds ?? []), [disabledUserIds]);

  const visibleUsers = useMemo(() => {
    return userKeys.filter((u) => !excludeSet.has(u.id));
  }, [userKeys, excludeSet]);

  const selectedUser = useMemo(() => {
    if (!value) return undefined;
    if (valueAsUser && typeof value === "object") return value;
    return visibleUsers.find((u) => u.id === value);
  }, [value, valueAsUser, visibleUsers]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", !selectedUser && "text-muted-foreground")}
        >
          {selectedUser?.displayName ?? "請選擇人員"}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
        <Command
          filter={(value, search) => {
            const name = visibleUsers.find((u) => u.id === value)?.displayName;
            return name?.includes(search) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="搜尋成員..." />
          <VList style={{ height: 180 }}>
            <CommandEmpty>找不到成員</CommandEmpty>
            <CommandGroup>
              {visibleUsers.map((user) => {
                const isDisabled = disabledSet.has(user.id);
                return (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    disabled={isDisabled}
                    onSelect={(id) => {
                      if (isDisabled) return;
                      onSelect(id as User["id"]);
                      setOpen(false);
                    }}
                    className={cn(isDisabled && "opacity-50 cursor-not-allowed", !user.active && "opacity-50")}
                  >
                    {user.displayName}

                    <Check
                      className={clsx("ml-auto size-4", selectedUser?.id === user.id ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </VList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
