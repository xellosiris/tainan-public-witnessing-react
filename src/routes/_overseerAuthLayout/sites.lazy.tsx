import DeleteDialog from "@/components/dialog/DeleteDialog";
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
import { deleteSite, getSite } from "@/services/site";
import type { Site } from "@/types/site";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/_overseerAuthLayout/sites")({
  component: Sites,
});

function Sites() {
  const [siteId, setSiteId] = useState<string>("");
  const [editSiteObj, setEditSiteObj] = useState<Site | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
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
    ],
    combine: (result) => ({
      setting: result[0].data,
      site: result[1].data,
      isLoading: result[0].isLoading || result[1].isLoading,
    }),
  });

  const { setting, site, isLoading } = results;

  useEffect(() => {
    setEditSiteObj(site);
  }, [site]);

  const onCreate = () => {
    setEditSiteObj(null);
  };

  const onSelectSite = (id: Site["id"]) => {
    setSiteId(id);
  };
  const onClose = () => {
    setOpen(false);
  };

  const mutation = useMutation({
    mutationFn: (siteId: Site["id"]) => deleteSite(siteId),
    onSuccess: () => {
      toast.success("刪除成功");
      queryClient.invalidateQueries({ queryKey: ["setting"] });
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: () => toast.error("刪除失敗"),
    onSettled: onClose,
  });
  const onDelete = () => {
    mutation.mutate(siteId);
    setSiteId("");
  };
  if (isLoading) return <Loading />;
  if (!setting) return <ErrorComponent />;
  const { siteKeys } = setting;

  return (
    <div className="flex flex-col max-w-3xl gap-8">
      {mutation.isPending && <Loading />}
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
        <Button onClick={onCreate}>新增</Button>
        {siteId && (
          <Button variant={"destructive"} onClick={() => setOpen(true)}>
            刪除
          </Button>
        )}
      </div>
      {editSiteObj !== undefined && <SiteForm key={editSiteObj?.id} siteEditObj={editSiteObj} setting={setting} />}
      {open && (
        <DeleteDialog
          title="刪除地點"
          description="你確定要刪除該地點嗎？這會刪除所有相關班次"
          confirmText={siteKeys.find((s) => s.id === siteId)?.name!}
          deleteFn={onDelete}
          onClose={onClose}
        />
      )}
    </div>
  );
}
