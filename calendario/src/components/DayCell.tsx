"use client";
import React from "react";
import clsx from "clsx";
import {
  format,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from "date-fns";

type DayCellProps = {
  day: Date;
  currentMonth: Date;
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
  hasTasks?: boolean;
};

export default function DayCell({
  day,
  currentMonth,
  selectedDate,
  onSelect,
  hasTasks,
}: DayCellProps) {
  const today = new Date();
  const isToday = isSameDay(day, today);
  const selected = selectedDate ? isSameDay(day, selectedDate) : false;
  const isPast = isBefore(startOfDay(day), startOfDay(today)) && !isToday;
  const isOtherMonth = !isSameMonth(day, currentMonth);

  // cor de fundo
  let bgColor = "bg-gray-100";

  if (isToday) bgColor = "bg-blue-200";
  else if (isPast) bgColor = "bg-red-100";

  return (
    <div
      onClick={() => onSelect(day)}
      role="button"
      className={clsx(
        "relative flex items-center justify-center rounded-2xl w-full h-full cursor-pointer select-none transition-all duration-200 ease-out shadow-sm",
        bgColor,
        "hover:scale-105 hover:shadow-md active:scale-95",
        isOtherMonth && "opacity-40"
      )}
    >
      {/* número do dia */}
      <div
        className={clsx(
          "z-10 font-bold text-black transition-all duration-200",
          "text-[2vw] sm:text-xl md:text-2xl lg:text-4xl"
        )}
      >
        {format(day, "d")}
      </div>

      {/* bolinha de tarefas responsiva */}
      {hasTasks && (
        <div
          className={clsx(
            "absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-200",
            "w-[10%] aspect-square bottom-[5%]", // ⚡ largura relativa + altura igual
            isToday
              ? "bg-blue-500"
              : isPast
              ? "bg-red-400"
              : "bg-blue-500"
          )}
        />
      )}

      {/* leve destaque quando selecionado */}
      {selected && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-300 animate-[pulse_1s_ease-in-out]" />
      )}
    </div>
  );
}
