import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNextDeadlineDate = (dayOfMonth: number) => {
  const makeDate = (monthsToAdd: number) => {
    const d = dayjs().add(monthsToAdd, "month");
    const lastDay = d.endOf("month").date();
    return d.date(Math.min(dayOfMonth, lastDay));
  };
  const nextMonthTarget = makeDate(1);
  return dayjs().isBefore(nextMonthTarget) ? nextMonthTarget : makeDate(2);
};
