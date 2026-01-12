import { user } from "@/App";
import ScheduleForm from "@/components/form/ScheduleForm";
import { getSchedule } from "@/services/schedule";
import { getSetting } from "@/services/setting";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_publisherAuthLayout/mySchedule")({
  component: PersonalSchedule,
});

function PersonalSchedule() {
  const { id: userId } = user;
  const { schedule, setting } = useSuspenseQueries({
    queries: [
      {
        queryKey: ["schedule", userId],
        queryFn: () => getSchedule(userId),
      },
      {
        queryKey: ["setting"],
        queryFn: getSetting,
      },
    ],
    combine: (results) => ({
      schedule: results[0].data,
      setting: results[1].data,
    }),
  });

  return (
    <div className="max-w-md">
      <ScheduleForm editScheduleObj={schedule} setting={setting} userId={userId} />
    </div>
  );
}
