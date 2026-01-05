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
import { getVacantShiftByMonth } from "@/services/shifts";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

export default function VacantShifts() {
  const [yearMonth, setYearMonth] = useState<string>(dayjs().format("YYYY-MM"));
  const yearMonths = useMemo(() => [dayjs().subtract(1, "month"), dayjs(), dayjs().add(1, "month")], []);
  const { data: shifts } = useQuery({
    queryKey: ["vacantShift", yearMonth],
    queryFn: () => getVacantShiftByMonth(yearMonth),
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
      <div className="flex flex-wrap gap-4">
        {shifts?.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} />
        ))}
      </div>
    </div>
  );
}
