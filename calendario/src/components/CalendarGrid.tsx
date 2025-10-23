"use client";
import React from "react";
import DayCell from "./DayCell";

export default function CalendarGrid({
  days,
  currentMonth,
  selectedDate,
  onSelect,
  tasksByDate,
}: any) {
  const weekDays = ["DOMINGO","SEGUNDA","TERCA","QUARTA","QUINTA","SEXTA","SABADO"];

  // Calcula número de linhas do mês (4, 5 ou 6)
  const numRows = Math.ceil(days.length / 7);

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 mb-3 shrink-0">
        {weekDays.map(w => (
          <div
            key={w}
            className="
              text-center 
              text-[0.6rem] sm:text-xs md:text-sm lg:text-base xl:text-lg
              font-semibold 
              text-gray-500
            "
          >
            {w}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div
        className="grid grid-cols-7 gap-3 flex-1 p-3"
        style={{ gridTemplateRows: `repeat(${numRows}, 1fr)` }} // ⚡ altura ajustável
      >
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
