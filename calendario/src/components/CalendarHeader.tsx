"use client";
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CalendarHeader({
  date,
  onPrev,
  onNext,
}: {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="w-full flex justify-center mb-8 mt-6 px-3">
      <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 lg:gap-12 max-w-xl w-full">
        
        {/* Botão anterior */}
        <button
          onClick={onPrev}
          className="shrink-0 px-4 py-3 rounded-full bg-gray-200 shadow-sm text-2xl sm:text-3xl md:text-4xl hover:scale-105 transition-transform"
        >
          ◀
        </button>

        {/* Nome do mês */}
        <div
          className="
            flex-1
            text-center
            bg-gray-200
            rounded-full
            py-3 sm:py-4
            text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide
            max-w-[320px] md:max-w-[400px] lg:max-w-[460px]
            overflow-hidden
          "
        >
          {format(date, "MMMM", { locale: ptBR }).toUpperCase()}
        </div>

        {/* Botão próximo */}
        <button
          onClick={onNext}
          className="shrink-0 px-4 py-3 rounded-full bg-gray-200 shadow-sm text-2xl sm:text-3xl md:text-4xl hover:scale-105 transition-transform"
        >
          ▶
        </button>

      </div>
    </div>
  );
}
