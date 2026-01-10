import {
  chain,
  difference,
  groupBy,
  keyBy,
  mapValues,
  sortBy,
} from "lodash-es";
import type { Schedule } from "@/types/schedule";
import type { SiteShift } from "@/types/siteShift";

type GroupedShifts<T = SiteShift> = Record<string, Record<number, T[]>>;

/**
 * 將班次按地點和星期分組
 * @param siteShifts - 班次列表
 * @param siteKeys - 地點列表
 * @returns 分組後的班次 { 地點名稱: { 星期: [班次] } }
 */

export function groupShiftsBySiteAndWeekday(
  siteShifts: SiteShift[],
): GroupedShifts {
  const bySite = groupBy(siteShifts, "siteId");
  return mapValues(bySite, (shifts) => {
    const byWeekday = groupBy(shifts, (s) => s.weekday);
    return Object.fromEntries(
      sortBy(Object.entries(byWeekday), ([weekday]) => Number(weekday)),
    ) as Record<number, SiteShift[]>;
  });
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
  siteShifts: SiteShift[],
): Record<
  string,
  Record<number, Array<{ siteShift: SiteShift; maxTimes: number }>>
> {
  const siteShiftMap = keyBy(siteShifts, "id");

  return (
    chain(siteShiftLimits)
      // 轉成可處理的 array，並補上 siteShift
      .toPairs()
      .map(([siteShiftId, maxTimes]) => {
        const siteShift = siteShiftMap[siteShiftId];
        if (!siteShift) return null;

        return {
          siteId: siteShift.siteId,
          weekday: siteShift.weekday,
          siteShift,
          maxTimes,
        };
      })
      .compact()

      // siteId 分組
      .groupBy("siteId")

      // weekday 分組 + 排序
      .mapValues((items) =>
        chain(items)
          .groupBy("weekday")
          .toPairs()
          .sortBy(([weekday]) => Number(weekday))
          .map(([weekday, values]) => [
            Number(weekday),
            values.map(({ siteShift, maxTimes }) => ({
              siteShift,
              maxTimes,
            })),
          ])
          .fromPairs()
          .value(),
      )
      .value()
  );
}

/**
 * 從 siteShiftLimits 過濾出已報名的班次
 * @param siteShiftLimits - 班次限制對象
 * @param siteShifts - 所有班次列表
 * @returns 已報名的班次列表
 */
export function getEnrolledShifts(
  siteShiftLimits: Schedule["siteShiftLimits"],
  siteShifts: SiteShift[],
): SiteShift[] {
  return siteShifts.filter(
    (shift) => siteShiftLimits[shift.id] !== undefined && shift.active,
  );
}

export function diffStringArray(prev: string[], next: string[]) {
  return {
    added: difference(next, prev),
    removed: difference(prev, next),
  };
}

export function hasShiftTimeOverlap(
  target: SiteShift,
  shifts: SiteShift[],
): boolean {
  return shifts.some(
    (shift) =>
      shift.id !== target.id &&
      shift.siteId === target.siteId &&
      shift.weekday === target.weekday &&
      target.startTime < shift.endTime &&
      shift.startTime < target.endTime,
  );
}
