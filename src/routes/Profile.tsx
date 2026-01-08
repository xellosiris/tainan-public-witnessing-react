import ScheduleForm from "@/components/form/ScheduleForm";
import UserForm from "@/components/form/UserForm";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSetting } from "@/services/setting";
import { getSiteShifts } from "@/services/siteShift";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const user: User = {
    note: "2018/1/11加入。",
    firebaseSub: "CzuIxz8hZRX4aQbLgTnTkk4hcBc2",
    telephone: "(06)2028640",
    id: "00cf91ce-f962-4025-837a-7b47453406dc",
    displayName: "葉憶秋",
    cellphone: "0987-754-230",
    lineSub: "U47b60d33acd6b812ea51cf47597ee6e6",
    name: "葉憶秋",
    gender: "female",
    active: true,
    congId: "c096a442-e326-4ead-83e2-4a10e3b5262c",
    permission: 3,
    availableSiteShifts: [],
  };
  const schedule = {
    canSchedule: true,
    siteShiftLimits: {
      "056337b9-4969-4405-9cad-dab0f6c7d029": 2,
      "0be68d41-1ca7-4f49-a787-261b27f8e3ce": 5,
      "14d39d44-ed09-4ac3-bb25-4a75bdd4c55b": 3,
      "23e698fb-a610-4194-9d66-1995b428cd7c": 1,
      "6de770c5-ff5e-48fd-8dda-225175bf56ea": 4,
      "87738992-0f28-4104-a209-5dac82e1728f": 4,
      "79f5661b-3689-4602-be37-2a15e25c400c": 4,
    },
    unavailableDates: [],
    partnerId: "",
  };
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
    <Tabs defaultValue="profile" className="max-w-md">
      <TabsList className="mb-5">
        <TabsTrigger value="profile">基本資料</TabsTrigger>
        <TabsTrigger value="schedule">排班設定</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UserForm editUserObj={user} />
      </TabsContent>
      <TabsContent value="schedule">
        <ScheduleForm editScheduleObj={schedule} siteShifts={siteShifts} siteKeys={siteKeys} />
      </TabsContent>
    </Tabs>
  );
}
