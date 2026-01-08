import { groupShiftsBySiteAndWeekday } from "@/lib/shiftUtils";
import type { SiteKey } from "@/types/site";
import type { SiteShift } from "@/types/siteShift";
import { MapPin } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { WEEKDAY_NAMES } from "../form/SiteForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type Props = {
  siteShifts: SiteShift[];
  siteKeys: SiteKey[];
  renderShift: (siteShift: SiteShift) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
};

export default function ShiftGroupedView({ siteShifts, siteKeys, renderShift, emptyState, className = "" }: Props) {
  // 使用工具函式按地點和星期分組
  const groupedShifts = useMemo(() => {
    return groupShiftsBySiteAndWeekday(siteShifts);
  }, [siteShifts]);

  if (Object.keys(groupedShifts).length === 0) {
    return emptyState || null;
  }

  return (
    <Tabs defaultValue={siteKeys[0]?.id} className={className}>
      <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
        {siteKeys
          .filter((s) => !!s.active)
          .map((site) => (
            <TabsTrigger key={site.id} value={site.id} className="gap-2">
              <MapPin className="size-4" />
              {site.name}
            </TabsTrigger>
          ))}
      </TabsList>

      {siteKeys
        .filter((s) => !!s.active)
        .map((site) => {
          const dayGroups = groupedShifts[site.id];
          const hasShifts = dayGroups && Object.keys(dayGroups).length > 0;

          return (
            <TabsContent key={site.id} value={site.id} className="mt-4">
              {!hasShifts && emptyState}
              {hasShifts && (
                <div className="space-y-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {Object.entries(dayGroups).map(([dayOfWeek, shifts]) => (
                    <div key={dayOfWeek}>
                      <div className="bg-secondary border-b border-gray-200 px-4 py-3">
                        <h4 className="text-base font-semibold text-primary">{WEEKDAY_NAMES[parseInt(dayOfWeek)]}</h4>
                      </div>

                      <div className="p-4 space-y-2">
                        {shifts.map((siteShift) => (
                          <div key={siteShift.id}>{renderShift(siteShift)}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
    </Tabs>
  );
}
