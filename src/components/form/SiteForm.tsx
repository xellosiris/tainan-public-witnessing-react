// SiteForm.tsx
import { siteSchema, type Site, type SiteShift } from "@/types/site";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";
import SiteShiftCard from "../card/SiteShiftCard";
import SiteShiftFormDialog from "../dialog/SiteShiftDialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "../ui/field";
import { Label } from "../ui/label";
import { SwitchField } from "./fields/SwitchField";
import { TextAreaField } from "./fields/TextAreaField";
import { TextField } from "./fields/TextField";

type Props = {
  siteEditObj: Site | null;
  onSubmit?: (data: Site) => void;
};

export default function SiteForm({ siteEditObj, onSubmit: onSubmitProp }: Props) {
  const form = useForm<Site>({
    resolver: zodResolver(siteSchema),
    defaultValues: siteEditObj || {
      id: v4(),
      active: true,
      name: "",
      description: "",
      shifts: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "shifts",
  });

  const [filter, setFilter] = useState<boolean>(true);
  const [editingShift, setEditingShift] = useState<{ shift: SiteShift; index: number } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 顯示或隱藏停用的班次
  const displayedShifts = useMemo(() => {
    return filter
      ? fields
          .filter((shift) => shift.active)
          .sort((a, b) => {
            if (a.weekday !== b.weekday) return a.weekday - b.weekday;
            return a.startTime.localeCompare(b.startTime);
          })
      : fields.sort((a, b) => {
          if (a.weekday !== b.weekday) return a.weekday - b.weekday;
          return a.startTime.localeCompare(b.startTime);
        });
  }, [fields, filter]);

  const handleAddShift = () => {
    setEditingShift(null);
    setIsDialogOpen(true);
  };

  const handleEditShift = (shift: SiteShift, index: number) => {
    setEditingShift({ shift, index });
    setIsDialogOpen(true);
  };

  const handleSaveShift = (shift: SiteShift) => {
    if (editingShift) {
      // 編輯現有班次
      update(editingShift.index, shift);
    } else {
      // 新增班次
      append(shift);
    }
    setIsDialogOpen(false);
    setEditingShift(null);
  };

  const handleDeleteShift = (index: number) => {
    remove(index);
  };

  const handleToggleShiftActive = (index: number) => {
    const shift = fields[index];
    update(index, { ...shift, active: !shift.active });
  };

  const onSubmit = (data: Site) => {
    console.log("提交站點資料:", data);
    if (onSubmitProp) {
      onSubmitProp(data);
    }
  };

  return (
    <>
      <div className="pb-20 space-y-6">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>基本資訊</FieldLegend>
            <FieldGroup>
              <TextField name="name" label="地點名稱" control={form.control} />
              <TextAreaField name="description" label="地點描述" control={form.control} />
              <SwitchField name="active" label="地點啟用" control={form.control} />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <FieldLegend>班次設定</FieldLegend>
              <Button type="button" onClick={handleAddShift} size="sm">
                新增班次
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Checkbox id="filter" checked={filter} onCheckedChange={(checked) => setFilter(!!checked)} />
              <Label htmlFor="filter" className="text-sm cursor-pointer select-none">
                隱藏未啟用的班次
              </Label>
            </div>

            {/* 班次列表 */}
            {displayedShifts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {filter && fields.length > 0
                    ? "所有班次都已停用，請取消篩選查看或啟用班次"
                    : "尚無安排班次，請點擊上方按鈕新增第一個班次"}
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {displayedShifts.map((field) => {
                  // 找出原始 index
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
            )}
          </FieldSet>
        </FieldGroup>

        {/* 顯示總班次數量 */}
        {fields.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            共 {fields.length} 個班次
            {filter && fields.filter((s) => !s.active).length > 0 && (
              <span> · 隱藏 {fields.filter((s) => !s.active).length} 個已停用班次</span>
            )}
          </div>
        )}
      </div>

      {/* Fixed submit button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t p-4 shadow-lg z-10">
        <div className="max-w-2xl mx-auto">
          <Button type="button" onClick={form.handleSubmit(onSubmit)} className="w-full" size="lg">
            儲存
          </Button>
        </div>
      </div>

      {/* Shift Form Dialog */}
      <SiteShiftFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        shift={editingShift?.shift || null}
        onSave={handleSaveShift}
      />
    </>
  );
}
