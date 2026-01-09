// SiteForm.tsx
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { siteFormSchema, type Site, type SiteForm } from "@/types/site";
import type { SiteShift } from "@/types/siteShift";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";
import SiteShiftCard from "../card/SiteShiftCard";
import SiteShiftFormDialog from "../dialog/SiteShiftDialog";
import { SwitchField } from "./fields/SwitchField";
import { TextAreaField } from "./fields/TextAreaField";
import { TextField } from "./fields/TextField";

export const WEEKDAY_NAMES: Record<number, string> = {
  0: "週一",
  1: "週二",
  2: "週三",
  3: "週四",
  4: "週五",
  5: "週六",
  6: "週日",
};

type EditingSiteShift = { mode: "create" } | { mode: "edit"; shift: SiteShift; index: number };

type Props = {
  siteEditObj: Site | null;
  onSubmit?: (data: Site) => void;
  siteShifts: SiteShift[];
};

export default function SiteForm({ siteEditObj, onSubmit: onSubmitProp, siteShifts }: Props) {
  const [filter, setFilter] = useState<boolean>(true);
  const [editingSiteShift, setEditingSiteShift] = useState<EditingSiteShift | null>(null);
  const siteId = siteEditObj?.id ?? v4();
  const form = useForm<SiteForm>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: !!siteEditObj
      ? {
          ...siteEditObj,
          siteShifts,
        }
      : {
          id: siteId,
          active: true,
          name: "",
          description: "",
          siteShifts: [],
        },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "siteShifts",
  });
  const groupedShifts = useMemo(() => {
    const filteredShifts = filter ? fields.filter((shift) => shift.active) : fields;
    // 按 weekday 分組
    const grouped = filteredShifts.reduce(
      (acc, shift) => {
        if (!acc[shift.weekday]) {
          acc[shift.weekday] = [];
        }
        acc[shift.weekday].push(shift);
        return acc;
      },
      {} as Record<number, typeof fields>
    );

    // 對每組內的班次按開始時間排序
    Object.keys(grouped).forEach((key) => {
      grouped[Number(key)].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return grouped;
  }, [fields, filter]);

  const handleAddShift = () => setEditingSiteShift({ mode: "create" });

  const handleEditShift = (shift: SiteShift, index: number) => setEditingSiteShift({ mode: "edit", shift, index });

  const handleSaveShift = (shift: SiteShift) => {
    if (editingSiteShift === null) return;
    if (editingSiteShift.mode === "edit") {
      update(editingSiteShift.index, shift);
    } else {
      append(shift);
    }
    setEditingSiteShift(null);
  };

  const handleDeleteShift = (index: number) => {
    remove(index);
  };

  const handleToggleShiftActive = (index: number) => {
    const shift = fields[index];
    update(index, { ...shift, active: !shift.active });
  };

  const onSubmit = (data: SiteForm) => {
    const submitData: Site = { ...data, siteShifts: data.siteShifts.map((s) => s.id) };
    console.log("提交資料:", { submitData });
    if (onSubmitProp) {
      onSubmitProp(submitData);
    }
  };

  const hasShifts = Object.keys(groupedShifts).length > 0;
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="pb-20 space-y-6">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>基本資訊</FieldLegend>
            <FieldGroup className="p-4 bg-white rounded-md shadow-sm">
              <TextField name="name" label="地點名稱" control={form.control} />
              <TextAreaField name="description" label="地點描述" control={form.control} />
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>啟用地點</ItemTitle>
                  <ItemDescription>啟用後，一般成員可以看到且報名排班</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <SwitchField name="active" label="啟用" control={form.control} />
                </ItemActions>
              </Item>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldSeparator />
            <div className="flex flex-col mb-4 gap-3 sm:flex-row sm:justify-between sm:items-center">
              <FieldLegend>班次設定</FieldLegend>
              <Button type="button" onClick={handleAddShift} size="sm">
                新增班次
              </Button>
            </div>

            <div className="flex items-center mb-4 gap-3">
              <Checkbox id="filter" checked={filter} onCheckedChange={(checked) => setFilter(!!checked)} />
              <Label htmlFor="filter" className="text-sm cursor-pointer select-none">
                隱藏未啟用的班次
              </Label>
            </div>

            {!hasShifts ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {filter && fields.length > 0 && "所有班次都已停用，請取消篩選查看或啟用班次"}
                  {!(filter && fields.length > 0) && "尚無安排班次，請點擊上方按鈕新增第一個班次"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {[0, 1, 2, 3, 4, 5, 6].map((weekday) => {
                  const shiftsForDay = groupedShifts[weekday];
                  if (!shiftsForDay || shiftsForDay.length === 0) return null;
                  return (
                    <div key={weekday} className="space-y-3">
                      <h3 className="sticky top-0 z-20 px-4 pt-2 pb-2 -mx-4 text-lg font-semibold border-b bg-background text-foreground/80">
                        {WEEKDAY_NAMES[weekday]} ({shiftsForDay.length})
                      </h3>
                      <div className="flex flex-wrap p-4 bg-white gap-4 rounded-md shadow-sm">
                        {shiftsForDay.map((field) => {
                          const originalIndex = fields.findIndex((f) => f.id === field.id);
                          return (
                            <SiteShiftCard
                              key={field.id}
                              siteShift={field}
                              onEdit={() => handleEditShift(field, originalIndex)}
                              onDelete={() => handleDeleteShift(originalIndex)}
                              onToggleActive={() => handleToggleShiftActive(originalIndex)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </FieldSet>
        </FieldGroup>

        {/* 顯示總班次數量 */}
        {fields.length > 0 && (
          <div className="text-sm text-center text-muted-foreground">
            共 {fields.length} 個班次
            {filter && fields.filter((s) => !s.active).length > 0 && (
              <span> · 隱藏 {fields.filter((s) => !s.active).length} 個已停用班次</span>
            )}
          </div>
        )}
      </div>

      {/* Fixed submit button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 border-t shadow-lg bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-sm mx-auto">
          <Button type="submit" className="w-full" size="lg">
            儲存
          </Button>
        </div>
      </div>

      {editingSiteShift && (
        <SiteShiftFormDialog
          siteId={siteId}
          siteShift={editingSiteShift.mode === "edit" ? editingSiteShift.shift : null}
          onSave={handleSaveShift}
          onOpenChange={() => setEditingSiteShift(null)}
        />
      )}
    </form>
  );
}
