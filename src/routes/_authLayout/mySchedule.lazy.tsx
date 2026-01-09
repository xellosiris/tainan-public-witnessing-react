import { SCHEDULE } from "@/assets/mock";
import ScheduleForm from "@/components/form/ScheduleForm";
import { Loading } from "@/components/ui/loading";
import { getSetting } from "@/services/setting";
import { getSiteShifts } from "@/services/siteShift";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authLayout/mySchedule")({
  component: PersonalSchedule,
});

function PersonalSchedule() {
  const { data: setting, isLoading } = useQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });

  const { data: siteShifts, isLoading: siteShiftsLoading } = useQuery({
    queryKey: ["siteShifts"],
    queryFn: getSiteShifts,
  });
  if (isLoading || siteShiftsLoading) return <Loading />;
  if (!setting) return <div>找不到設定檔</div>;
  if (!siteShifts) return <div>尚未設定任何班次</div>;
  const { siteKeys } = setting;

  return (
    <div className="max-w-3xl">
      <ScheduleForm editScheduleObj={SCHEDULE} siteShifts={siteShifts} siteKeys={siteKeys} />
    </div>
  );
}
