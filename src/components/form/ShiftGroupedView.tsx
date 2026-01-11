import { WEEKDAY_NAMES } from "@/assets/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groupShiftsBySiteAndWeekday } from "@/lib/shiftUtils";
import type { SiteKey } from "@/types/site";
import type { SiteShift } from "@/types/siteShift";
import { MapPin } from "lucide-react";
import { type ReactNode, useMemo } from "react";

type Props = {
  siteShifts: SiteShift[];
  siteKeys: SiteKey[];
  renderShift: (siteShift: SiteShift) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
};

export default function ShiftGroupedView({ siteShifts, siteKeys, renderShift, emptyState, className = "" }: Props) {
  const groupedShifts = useMemo(() => {
    return groupShiftsBySiteAndWeekday(siteShifts);
  }, [siteShifts]);

  if (Object.keys(groupedShifts).length === 0) {
    return emptyState || null;
  }

  return (
    <Tabs defaultValue={siteKeys[0]?.id} className={className}>
      <TabsList className="flex-wrap justify-start w-full h-auto overflow-x-auto">
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
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg space-y-1">
                  {Object.entries(dayGroups).map(([dayOfWeek, shifts]) => (
                    <div key={dayOfWeek}>
                      <div className="px-4 py-3 border-b border-gray-200 bg-secondary">
                        <h4 className="text-base font-semibold text-primary">
                          {WEEKDAY_NAMES[parseInt(dayOfWeek, 10)]}
                        </h4>
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
