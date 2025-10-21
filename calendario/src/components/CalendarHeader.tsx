"use client";
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CalendarHeader({ date, onPrev, onNext }: { date: Date; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="w-full flex items-center justify-between mb-3">
      <button onClick={onPrev} className="px-3 py-2 rounded-full bg-gray-200 shadow-sm">◀</button>
      <div className="px-6 py-3 rounded-full bg-gray-200 text-2xl font-extrabold tracking-wide shadow soft">
        {format(date, "MMMM", { locale: ptBR }).toUpperCase()}
      </div>
      <button onClick={onNext} className="px-3 py-2 rounded-full bg-gray-200 shadow-sm">▶</button>
    </div>
  );
}