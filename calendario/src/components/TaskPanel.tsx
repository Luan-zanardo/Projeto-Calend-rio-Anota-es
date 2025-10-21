"use client";
import React from "react";
import { format } from "date-fns";

type Task = { id: string; text: string; done?: boolean };

export default function TaskPanel({ date, tasks, onToggleDone, onDelete }: {
  date: Date | null;
  tasks: Record<string, Task[]>;
  onToggleDone: (dateKey: string, id: string) => void;
  onDelete: (dateKey: string, id: string) => void;
}) {
  if (!date) {
    return (
      <aside className="w-80 bg-white rounded-2xl shadow p-4">
        <div className="text-center text-xl font-bold text-gray-400">Selecione um dia</div>
      </aside>
    );
  }

  const key = format(date, "yyyy-MM-dd");
  const list = tasks[key] || [];

  return (
    <aside className="w-80 bg-white rounded-2xl shadow p-4 flex flex-col">
      <div className="text-center text-4xl font-bold text-white bg-blue-300 rounded-lg py-2 mb-3">{format(date, "d")}</div>

      <div className="flex-1 bg-gray-100 rounded-b-lg p-3 overflow-auto">
        {list.length === 0 && <div className="text-gray-500 text-sm text-center">Sem tarefas</div>}
        <ul className="space-y-3">
          {list.map(t => (
            <li key={t.id} className="flex items-start gap-3 bg-white p-2 rounded-md shadow-xs">
              <input type="checkbox" checked={t.done} onChange={() => onToggleDone(key, t.id)} className="mt-1" />
              <div className={t.done ? "line-through text-gray-400" : ""}>{t.text}</div>
              <button onClick={() => onDelete(key, t.id)} className="ml-auto text-sm text-red-500">Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}