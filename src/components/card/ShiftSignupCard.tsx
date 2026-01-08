// SiteShiftCard.tsx
import { cn } from "@/lib/utils";
import { getSetting } from "@/services/settings";
import type { Site, SiteShift } from "@/types/site";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon } from "lucide-react";
import { WEEKDAY_NAMES } from "../form/SiteForm";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loading } from "../ui/loading";

type Props = {
  siteId: Site["id"];
  siteShift: SiteShift;
};

export default function ShiftSignupCard({ siteId, siteShift }: Props) {
  const { data: setting, isLoading } = useQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });
  if (isLoading) return <Loading />;
  if (!setting) return <div>找不到設定檔</div>;
  const { siteKeys } = setting;
  return (
    <Card className={cn("gap-1 p-2 w-full max-w-sm transition-all", !siteShift.active && "opacity-60 bg-muted/50")}>
      <CardHeader className="p-3 pb-2">
        <CardTitle>{siteKeys.find((s) => s.id === siteId)?.name}</CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={siteShift.active ? "default" : "secondary"}>{WEEKDAY_NAMES[siteShift.weekday]}</Badge>
            {!siteShift.active && (
              <Badge variant="outline" className="text-xs">
                已停用
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col p-3 py-2 gap-2">
        <div className="flex items-center text-sm gap-2 text-muted-foreground">
          <ClockIcon className="size-4 shrink-0" />
          <span>
            {siteShift.startTime} ～ {siteShift.endTime}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
