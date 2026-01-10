import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import SettingForm from "@/components/form/SettingForm";
import { getSetting } from "@/services/setting";

export const Route = createLazyFileRoute("/_overseerLayout/setting")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });

  return (
    <div className="max-w-3xl">
      <SettingForm editSettingObj={data} />
    </div>
  );
}
