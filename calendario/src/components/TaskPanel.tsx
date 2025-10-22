"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { IconPlus } from "./IconButton";

export type Task = {
  id: string;
  text: string;
  description?: string;
  done?: boolean;
};

export default function TaskPanel({
  date,
  tasks,
  onToggleDone,
  onDelete,
  onAddTask,
}: {
  date: Date | null;
  tasks: Record<string, Task[]>;
  onToggleDone: (dateKey: string, id: string) => void;
  onDelete: (dateKey: string, id: string) => void;
  onAddTask: (text: string, description?: string) => void;
}) {
  const key = date ? format(date, "yyyy-MM-dd") : null;
  const list = key ? tasks[key] || [] : [];

  const [showAddInputs, setShowAddInputs] = useState(false);
  const [newText, setNewText] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAdd = () => {
    if (!newText.trim() || !key) return;
    onAddTask(newText.trim(), newDescription.trim() || undefined);
    setNewText("");
    setNewDescription("");
    setShowAddInputs(false);
  };

  return (
    <aside className="w-full md:w-auto flex-1 bg-white shadow-lg flex flex-col h-full rounded-b-2xl md:rounded-b-none md:rounded-r-2xl">
      {!date ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 font-bold text-lg">
          Selecione um dia
        </div>
      ) : (
        <>
          {/* Cabeçalho */}
          <div className="text-center text-4xl md:text-5xl font-bold text-white bg-blue-500 py-4 md:py-3 flex flex-col items-center rounded-t-2xl">
            <span className="text-6xl md:text-6xl">{format(date, "d")}</span>
            <span className="text-lg md:text-2xl">{format(date, "MMMM yyyy")}</span>
          </div>

          {/* Lista de tarefas scrollável */}
          <div className="flex-1 overflow-auto p-4">
            {list.length === 0 && (
              <div className="text-gray-500 text-sm text-center mt-4">
                Sem tarefas
              </div>
            )}

            <ul className="space-y-3">
              {list.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-gray-200 px-4 py-3 rounded-full shadow-sm min-w-0"
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => key && onToggleDone(key, t.id)}
                    className="w-5 h-5 rounded-full border-2 border-gray-400 bg-gray-100 checked:bg-gray-500 checked:border-gray-500 appearance-none cursor-pointer transition-all duration-200 hover:scale-110 mt-px shrink-0"
                  />

                  <div className="flex-1 min-w-0 w-full">
                    <span className={`block text-base wrap-break-words ${t.done ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {t.text}
                    </span>
                    {t.description && (
                      <p className="text-sm text-gray-600 mt-1 wrap-break-words w-full">{t.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => key && onDelete(key, t.id)}
                    className="text-sm text-red-500 hover:text-red-600 transition shrink-0"
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Botão para mostrar inputs */}
          {!showAddInputs && (
            <div className="p-3">
              <button
                onClick={() => setShowAddInputs(true)}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-full transition w-full"
              >
                <IconPlus /> Adicionar tarefa
              </button>
            </div>
          )}

          {/* Inputs para nova tarefa */}
          {showAddInputs && (
            <div className="p-3 flex flex-col gap-2 border-t border-gray-200">
              <input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Título da tarefa"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition wrap-break-word"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Descrição (opcional)"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition wrap-break-word"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-full transition"
                >
                  <IconPlus /> Adicionar
                </button>
                <button
                  onClick={() => setShowAddInputs(false)}
                  className="flex-1 px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}