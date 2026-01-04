import { getPersonalShiftByMonth } from "@/services/shifts";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import ShiftCard from "@/components/card/ShiftCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type Props = {
  id: User["id"];
};

export default function PersonalShifts({ id }: Props) {
  const [yearMonth, setYearMonth] = useState<string>(dayjs().format("YYYY-MM"));
  const yearMonths = useMemo(() => [dayjs().subtract(1, "month"), dayjs(), dayjs().add(1, "month")], []);
  const { data: shifts } = useQuery({
    queryKey: ["shifts", id],
    queryFn: () => getPersonalShiftByMonth(id, yearMonth),
  });
  return (
    <div className="space-y-5">
      <Select value={yearMonth} onValueChange={setYearMonth}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="選擇月份" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>月份</SelectLabel>
            {yearMonths.map((month) => (
              <SelectItem key={month.format("YYYY-MM")} value={month.format("YYYY-MM")}>
                {month.format("YYYY年MM月")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex gap-4 flex-wrap">
        {shifts?.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} />
        ))}
      </div>
    </div>
  );
}
