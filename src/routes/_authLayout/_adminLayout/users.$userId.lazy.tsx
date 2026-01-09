import { SCHEDULE, USER } from "@/assets/mock";
import ScheduleForm from "@/components/form/ScheduleForm";
import UserForm from "@/components/form/UserForm";
import ErrorComponent from "@/components/route/ErrorComponent";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSetting } from "@/services/setting";
import { getSiteShifts } from "@/services/siteShift";
import type { Setting } from "@/types/setting";
import type { SiteShift } from "@/types/siteShift";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authLayout/_adminLayout/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  const results: [
    // UseQueryResult<User | undefined>,
    UseQueryResult<Setting | undefined>,
    UseQueryResult<SiteShift[] | undefined>,
  ] = useQueries({
    queries: [
      // {
      //   queryKey: ["users", userId],
      //   queryFn: () => getUser(userId),
      //   enabled: !!userId,
      // },
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

  const [
    // userQuery,
    settingQuery,
    siteShiftsQuery,
  ] = results;

  // const user = userQuery.data;
  const setting = settingQuery.data;
  const siteShifts = siteShiftsQuery.data;

  if (results.some((q) => q.isLoading)) {
    return <Loading />;
  }

  if (
    // !user ||
    !setting
  )
    return <ErrorComponent />;
  if (!siteShifts) return <ErrorComponent warningText="請先設定地點班次" />;

  const { siteKeys } = setting;

  return (
    <Tabs defaultValue={"user"}>
      <TabsList>
        <TabsTrigger value={"user"}>基本資料</TabsTrigger>
        <TabsTrigger value={"schedule"}>排班設定</TabsTrigger>
      </TabsList>
      <TabsContent value={"user"} className="max-w-3xl">
        <UserForm editUserObj={USER} />
      </TabsContent>
      <TabsContent value="schedule" className="max-w-3xl">
        <ScheduleForm editScheduleObj={SCHEDULE} siteShifts={siteShifts} siteKeys={siteKeys} />
      </TabsContent>
    </Tabs>
  );
}
