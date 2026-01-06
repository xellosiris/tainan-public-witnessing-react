import SiteForm from "@/components/form/SiteForm";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSite, getSiteKeys } from "@/services/sites";
import type { Site } from "@/types/site";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Props = {};

export default function Sites({}: Props) {
  const [siteId, setSiteId] = useState<string>("");
  const [siteObj, setSiteObj] = useState<Site | null | undefined>(undefined);

  const { data: siteKeys } = useQuery({
    queryKey: ["siteKeys"],
    queryFn: getSiteKeys,
  });

  const { data: site } = useQuery({
    queryKey: ["sites", siteId],
    queryFn: () => getSite(siteId),
    enabled: !!siteId,
  });

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
