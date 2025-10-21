"use client";
import React from "react";
import DayCell from "./DayCell";
import { isSameMonth, isSameDay } from "date-fns";

export default function CalendarGrid({
  days,
  currentMonth,
  selectedDate,
  onSelect,
  tasksByDate,
}: any) {
  const weekDays = ["DOMINGO","SEGUNDA","TERCA","QUARTA","QUINTA","SEXTA","SABADO"];

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-3 mb-2">
        {weekDays.map(w => (
          <div key={w} className="text-center text-xs text-gray-500 font-semibold">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((d: Date) => (
          <DayCell
            key={d.toISOString()}
            day={d}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelect={onSelect}
            hasTasks={Boolean(tasksByDate[d.toISOString()?.slice(0,10)])}
          />
        ))}
      </div>
    </div>
  );
}