import SiteDialog from "@/components/dialog/SiteDialog";
import SiteForm from "@/components/form/SiteForm";
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
import type { Site } from "@/types/site";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Props = {};

export default function Sites({}: Props) {
  const [siteId, setSiteId] = useState<string>("");
  const [siteEditObj, setEditSiteObj] = useState<Site | null | undefined>(undefined);
  const results = useQueries({
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
  const setting = settingQuery.data;
  const site = siteQuery.data;
  const siteShifts = siteShiftsQuery.data;
  const isLoading = settingQuery.isLoading || siteQuery.isLoading || siteShiftsQuery.isLoading;

  const onSelectSite = (siteId: string) => {
    setSiteId(siteId);
  };
  useEffect(() => {
    if (site) {
      setEditSiteObj(site);
    }
  }, [site]);
  if (isLoading) return <Loading />;
  if (!setting) return <div>設定檔不存在</div>;

  const { siteKeys } = setting;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
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
                {siteKeys?.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setEditSiteObj(null)}>新增</Button>
      </div>
      {!!siteEditObj && <SiteForm key={siteEditObj.id} siteEditObj={siteEditObj} siteShifts={siteShifts || []} />}
      {siteEditObj === null && <SiteDialog onClose={() => setEditSiteObj(undefined)} />}
    </div>
  );
}
