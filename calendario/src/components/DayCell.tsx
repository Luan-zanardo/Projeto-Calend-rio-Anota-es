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
        "relative flex items-center justify-center select-none cursor-pointer transition-transform transform",
        "rounded-2xl shadow-md",
        !isSameMonth(day, currentMonth) && "opacity-40",
        "hover:scale-105",
        "text-black",
        selected && !isToday && isPast && "bg-gray-100 border-4 border-red-400",
        selected && !isToday && !isPast&& "bg-gray-100 border-4 border-blue-300",
        selected && isToday && "bg-blue-200 font-bold border-4 border-blue-300",
        isToday && !selected && "bg-blue-200 font-bold border-blue-300",
        !isToday && !selected && "bg-gray-100",
        "w-full h-full shrink-0"
      )}
    >
      {/* Número do dia */}
      <div className="z-30 text-[2vw] sm:text-xl md:text-2xl lg:text-5xl font-bold flex items-center justify-center">
        {format(day, "d")}
      </div>

      {/* Pontinho de tarefa */}
      {hasTasks && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-blue-600 z-10" />
      )}

      {isPast && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <span className="text-[3vw] sm:text-2xl md:text-3xl lg:text-6xl font-bold text-red-400 opacity-90">✕</span>
        </div>
      )}
    </div>
  );
}
