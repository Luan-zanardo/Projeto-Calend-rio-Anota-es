import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths } from "date-fns";

export function getCalendarDays(currentMonth: Date) {
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function nextMonth(date: Date) {
  return addMonths(date, 1);
}

export function prevMonth(date: Date) {
  return subMonths(date, 1);
}
