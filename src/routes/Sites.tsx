import SiteForm from "@/components/form/SiteForm";
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
import { getSetting } from "@/services/settings";
import { getSite } from "@/services/sites";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Props = {};

export default function Sites({}: Props) {
  const [siteId, setSiteId] = useState<string>("");
  const { data: setting, isLoading } = useQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
  });

  const { data: site, isLoading: siteLoading } = useQuery({
    queryKey: ["sites", siteId],
    queryFn: () => getSite(siteId),
    enabled: !!siteId,
  });
  if (siteLoading || isLoading) return <Loading />;
  if (!setting) return <div>設定檔不存在</div>;
  const { siteKeys } = setting;

  return (
    <div className="flex flex-col gap-8">
      <Select value={siteId} onValueChange={setSiteId}>
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
      {site !== undefined && <SiteForm siteEditObj={site} />}
    </div>
  );
}
