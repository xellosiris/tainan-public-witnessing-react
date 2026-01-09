import SiteDialog from "@/components/dialog/SiteDialog";
import SiteForm from "@/components/form/SiteForm";
import ErrorComponent from "@/components/route/ErrorComponent";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSetting } from "@/services/setting";
import { getSite } from "@/services/site";
import { getSiteShift } from "@/services/siteShift";
import type { Setting } from "@/types/setting";
import type { Site } from "@/types/site";
import type { SiteShift } from "@/types/siteShift";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/_authLayout/_adminLayout/sites")({
  component: Sites,
});

function Sites() {
  const [siteId, setSiteId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const results: [
    UseQueryResult<Setting | undefined>,
    UseQueryResult<Site | undefined>,
    UseQueryResult<SiteShift[] | undefined>,
  ] = useQueries({
    queries: [
      {
        queryKey: ["setting"],
        queryFn: getSetting,
      },
      {
        queryKey: ["sites", siteId],
        queryFn: () => getSite(siteId),
        enabled: !!siteId,
      },
      {
        queryKey: ["siteShifts", siteId],
        queryFn: () => getSiteShift(siteId),
        enabled: !!siteId,
      },
    ],
  });

  const [settingQuery, siteQuery, siteShiftsQuery] = results;
  const isLoading = settingQuery.isLoading || siteQuery.isLoading || siteShiftsQuery.isLoading;
  if (isLoading) return <Loading />;
  const setting = settingQuery.data;
  const site = siteQuery.data;
  const siteShifts = siteShiftsQuery.data;

  const onSelectSite = (siteId: string) => {
    setSiteId(siteId);
  };

  if (!setting || (siteId && !site)) return <ErrorComponent />;
  const { siteKeys } = setting;

  return (
    <div className="flex flex-col max-w-3xl gap-8">
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label>地點</Label>
          <Select value={siteId} onValueChange={onSelectSite}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="選擇地點" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>地點</SelectLabel>
                {siteKeys.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setOpen(true)}>新增</Button>
      </div>

      {siteId && site && <SiteForm key={site.id} siteEditObj={site} siteShifts={siteShifts!} />}
      {open && <SiteDialog onClose={() => setOpen(false)} />}
    </div>
  );
}
