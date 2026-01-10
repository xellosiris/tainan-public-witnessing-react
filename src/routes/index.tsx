import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { groupBy } from "lodash-es";
import { useMemo } from "react";
import ShiftCard from "@/components/card/ShiftCard";
import { Label } from "@/components/ui/label";
import { getSetting } from "@/services/setting";
import { getShiftsByDate } from "@/services/shift";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const today = dayjs().format("YYYY-MM-DD");
  const [{ data: shifts }, { data: setting }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["shifts", today],
        queryFn: () => getShiftsByDate(today),
      },
      {
        queryKey: ["setting"],
        queryFn: getSetting,
      },
    ],
  });

  const shiftsGroupBySite = useMemo(() => groupBy(shifts, "siteId"), [shifts]);
  return (
    <div className="space-y-2">
      <Label className="text-2xl">今日班表</Label>
      <div className="flex flex-col gap-3">
        {Object.entries(shiftsGroupBySite).map(([siteId, shifts]) => (
          <div key={siteId} className="flex flex-col gap-1.5">
            <h3 className="text-xl font-semibold">
              {setting?.siteKeys.find((s) => s.id === siteId)?.name}
            </h3>
            <div className="flex flex-wrap gap-4">
              {shifts.map((shift) => (
                <ShiftCard key={shift.id} shift={shift} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
