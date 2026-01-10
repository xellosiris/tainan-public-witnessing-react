import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { CircleChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import ShiftCard from "@/components/card/ShiftCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVacantShiftByMonth } from "@/services/shift";

export const Route = createFileRoute("/_publisherLayout/vacantShifts")({
  component: VacantShifts,
});

function VacantShifts() {
  const [yearMonth, setYearMonth] = useState<string>(dayjs().format("YYYY-MM"));
  const yearMonths = useMemo(() => [dayjs(), dayjs().add(1, "month")], []);
  const { data: shifts } = useSuspenseQuery({
    queryKey: ["vacantShift", yearMonth],
    queryFn: () => getVacantShiftByMonth(yearMonth),
  });
  return (
    <div className="flex flex-col gap-5">
      <Select value={yearMonth} onValueChange={setYearMonth}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="選擇月份" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>月份</SelectLabel>
            {yearMonths.map((month) => (
              <SelectItem
                key={month.format("YYYY-MM")}
                value={month.format("YYYY-MM")}
              >
                {month.format("YYYY年MM月")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Alert className="max-w-xs">
        <CircleChevronRightIcon />
        <AlertTitle>說明</AlertTitle>
        <AlertDescription>
          班次額滿後會自動從頁面移除，請到「我的班表」中查看。如果希望取消報名請聯繫管理員。
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-4">
        {shifts
          .filter((s) =>
            dayjs().isBefore(
              dayjs(`${s.date} ${s.startTime}`).subtract(2, "hour"),
            ),
          )
          .map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))}
      </div>
    </div>
  );
}
