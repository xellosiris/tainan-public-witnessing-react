import type { Schedule } from "@/types/schedule";
import type { SiteShift } from "@/types/siteShift";

type GroupedShifts<T = SiteShift> = Record<string, Record<number, T[]>>;

/**
 * 將班次按地點和星期分組
 * @param siteShifts - 班次列表
 * @param siteKeys - 地點列表
 * @returns 分組後的班次 { 地點名稱: { 星期: [班次] } }
 */
export function groupShiftsBySiteAndWeekday(siteShifts: SiteShift[]): GroupedShifts {
  const groups: GroupedShifts = {};

  siteShifts.forEach((siteShift) => {
    const { weekday, siteId } = siteShift;

    if (!groups[siteId]) {
      groups[siteId] = {};
    }
    if (!groups[siteId][weekday]) {
      groups[siteId][weekday] = [];
    }

    groups[siteId][weekday].push(siteShift);
  });

  // 對每個地點的星期進行排序
  Object.keys(groups).forEach((siteId) => {
    const sortedDays: Record<number, SiteShift[]> = {};
    Object.keys(groups[siteId])
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((day) => {
        sortedDays[day] = groups[siteId][day];
      });
    groups[siteId] = sortedDays;
  });

  return groups;
}

/**
 * 將班次限制 (siteShiftLimits) 轉換為帶有 maxTimes 的分組結構
 * @param siteShiftLimits - 班次限制對象 { siteShiftId: maxTimes }
 * @param siteShifts - 所有班次列表
 * @param siteKeys - 地點列表
 * @returns 分組後的班次 (包含 maxTimes)
 */
export function groupShiftLimitsBySiteAndWeekday(
  siteShiftLimits: Schedule["siteShiftLimits"],
  siteShifts: SiteShift[]
): Record<string, Record<number, Array<{ siteShift: SiteShift; maxTimes: number }>>> {
  const groups: Record<string, Record<number, Array<{ siteShift: SiteShift; maxTimes: number }>>> = {};

  Object.entries(siteShiftLimits).forEach(([siteShiftId, maxTimes]) => {
    const siteShift = siteShifts.find((s) => s.id === siteShiftId);
    if (!siteShift) return;

    const { siteId, weekday } = siteShift;

    if (!groups[siteId]) {
      groups[siteId] = {};
    }
    if (!groups[siteId][weekday]) {
      groups[siteId][weekday] = [];
    }
    groups[siteId][weekday].push({
      siteShift,
      maxTimes,
    });
  });

  // 對每個地點的星期進行排序
  Object.keys(groups).forEach((siteId) => {
    const sortedDays: Record<number, Array<{ siteShift: SiteShift; maxTimes: number }>> = {};
    Object.keys(groups[siteId])
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((day) => {
        sortedDays[day] = groups[siteId][day];
      });
    groups[siteId] = sortedDays;
  });

  return groups;
}

/**
 * 從 siteShiftLimits 過濾出已報名的班次
 * @param siteShiftLimits - 班次限制對象
 * @param siteShifts - 所有班次列表
 * @returns 已報名的班次列表
 */
export function getEnrolledShifts(siteShiftLimits: Schedule["siteShiftLimits"], siteShifts: SiteShift[]): SiteShift[] {
  return siteShifts.filter((shift) => siteShiftLimits[shift.id] !== undefined && shift.active);
}
