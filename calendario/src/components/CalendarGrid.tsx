"use client";
import React from "react";
import DayCell from "./DayCell";
import type { Task } from "@/components/TaskPanel";

interface CalendarGridProps {
  days: Date[];
  currentMonth: Date;
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  tasksByDate: Record<string, Task[]>;
}

export default function CalendarGrid({
  days,
  currentMonth,
  selectedDate,
  onSelect,
  tasksByDate,
}: CalendarGridProps) {
  const weekDays = ["DOMINGO", "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];
  const numRows = Math.ceil(days.length / 7);

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 mb-3 shrink-0">
        {weekDays.map((w) => (
          <div
            key={w}
            className="text-center text-[0.6rem] sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-gray-500"
          >
            {w}
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-3 flex-1 p-3"
        style={{ gridTemplateRows: `repeat(${numRows}, 1fr)` }}
      >
        {days.map((d) => (
          <DayCell
            key={d.toISOString()}
            day={d}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelect={onSelect}
            hasTasks={tasksByDate[d.toISOString().slice(0, 10)]?.length > 0}
          />
        ))}
      </div>
    </div>
  );
}
