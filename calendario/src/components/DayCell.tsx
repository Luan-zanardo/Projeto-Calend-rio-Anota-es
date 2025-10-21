"use client";
import React from "react";
import clsx from "clsx";
import { format, isSameMonth, isSameDay, isBefore, startOfDay } from "date-fns";

type DayCellProps = {
  day: Date;
  currentMonth: Date;
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
  hasTasks?: boolean;
};

export default function DayCell({ day, currentMonth, selectedDate, onSelect, hasTasks }: DayCellProps) {
  const today = new Date();
  const isToday = isSameDay(day, today);
  const selected = selectedDate ? isSameDay(day, selectedDate) : false;
  const isPast = isBefore(startOfDay(day), startOfDay(today)) && !isToday;

  return (
    <div
      onClick={() => onSelect(day)}
      role="button"
      className={clsx(
        "relative day-cell h-16 flex items-center justify-center select-none cursor-pointer transition-transform transform",
        "rounded-xl",
        "bg-gray-100",
        !isSameMonth(day, currentMonth) && "opacity-40",
        "hover:scale-105",
        selected && "bg-primary text-white shadow-lg",
        isToday && !selected && "bg-blue-200 text-white font-bold"
      )}
    >
      {/* day number */}
      <div className="z-10 text-sm">{format(day, "d")}</div>

      {/* small task dot */}
      {hasTasks && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-blue-600 z-10" />
      )}

      {/* X overlay for past days */}
      {isPast && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="text-3xl day-x opacity-90">✕</span>
        </div>
      )}

      {/* subtle shadow border */}
      <div className="absolute -bottom-1 -right-1 w-full h-full rounded-xl pointer-events-none" />
    </div>
  );
}