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
    <div className="w-full flex justify-center my-6 px-4">
      <div className="flex items-center justify-between gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl">
        
        {/* Botão anterior */}
        <button
          onClick={onPrev}
          className="
            flex items-center justify-center
            w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20
            rounded-xl bg-gray-100 text-black font-bold
            shadow-md hover:bg-gray-200 hover:scale-105 transition-transform duration-200
          "
        >
          ◀
        </button>

        {/* Container do mês (somente visual) */}
        <div
          className="
            flex-1 text-center
            bg-gray-100
            rounded-3xl
            py-4 sm:py-5 md:py-6
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            font-extrabold tracking-wide
            shadow-inner
            transition-transform duration-200
            select-none
          "
        >
          {format(date, "MMMM", { locale: ptBR }).toUpperCase()}
        </div>

        {/* Botão próximo */}
        <button
          onClick={onNext}
          className="
            flex items-center justify-center
            w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20
            rounded-xl bg-gray-100 text-black font-bold
            shadow-md hover:bg-gray-200 hover:scale-105 transition-transform duration-200
          "
        >
          ▶
        </button>

      </div>
    </div>
  );
}
