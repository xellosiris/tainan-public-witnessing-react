import { user } from "@/App";
import ScheduleForm from "@/components/form/ScheduleForm";
import { getSchedule } from "@/services/schedule";
import { getSetting } from "@/services/setting";
import { getSiteShifts } from "@/services/siteShift";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_publisherAuthLayout/mySchedule")({
  component: PersonalSchedule,
});

function PersonalSchedule() {
  const { id: userId } = user;
  const { schedule, setting, siteShifts } = useSuspenseQueries({
    queries: [
      {
        queryKey: ["schedule", userId],
        queryFn: () => getSchedule(userId),
      },
      {
        queryKey: ["setting"],
        queryFn: getSetting,
      },
      {
        queryKey: ["siteShifts"],
        queryFn: getSiteShifts,
      },
    ],
    combine: (results) => ({
      schedule: results[0].data,
      setting: results[1].data,
      siteShifts: results[2].data,
    }),
  });

  return (
    <div className="max-w-md">
      <ScheduleForm editScheduleObj={schedule} siteShifts={siteShifts} setting={setting} />
    </div>
  );
}
