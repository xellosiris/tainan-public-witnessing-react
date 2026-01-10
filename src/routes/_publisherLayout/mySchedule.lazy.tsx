import { useSuspenseQueries } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { SCHEDULE } from "@/assets/mock";
import ScheduleForm from "@/components/form/ScheduleForm";
import { getSetting } from "@/services/setting";
import { getSiteShifts } from "@/services/siteShift";

export const Route = createLazyFileRoute("/_publisherLayout/mySchedule")({
  component: PersonalSchedule,
});

function PersonalSchedule() {
  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: ["setting"],
        queryFn: getSetting,
      },
      {
        queryKey: ["siteShifts"],
        queryFn: getSiteShifts,
      },
    ],
  });

  const [settingResult, siteShiftsResult] = results;
  const setting = settingResult.data;
  const siteShifts = siteShiftsResult.data;
  const { siteKeys } = setting;

  return (
    <div className="max-w-3xl">
      <ScheduleForm
        editScheduleObj={SCHEDULE}
        siteShifts={siteShifts}
        siteKeys={siteKeys}
      />
    </div>
  );
}
