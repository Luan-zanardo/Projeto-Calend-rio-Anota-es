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
    <aside className="flex flex-col bg-white rounded-b-2xl shadow-md md:h-full max-h-full">
      {!date ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 font-bold text-lg">
          Selecione um dia
        </div>
      ) : (
        <>
          {/* Cabeçalho fixo */}
          <div className="shrink-0 text-center text-4xl md:text-5xl font-bold text-white bg-blue-500 py-4 flex flex-col items-center">
            <span className="text-6xl">{format(date, "d")}</span>
            <span className="text-lg">{format(date, "MMMM yyyy")}</span>
          </div>

          {/* Lista de tarefas rolável */}
          <div className="flex-1 overflow-y-auto p-4">
            {list.length === 0 && (
              <div className="text-gray-500 text-sm text-center mt-4">
                Sem tarefas
              </div>
            )}
            <ul className="space-y-4">
              {list.map((t) => (
                <li
                  key={t.id}
                  className={`relative overflow-hidden px-4 py-3 rounded-xl shadow-sm w-full border border-gray-200 ${
                    t.done ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {/* Linha superior: checkbox + título + botões */}
                  <div className="flex items-start justify-between gap-3 pb-2 border-b border-gray-200">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => key && onToggleDone(key, t.id)}
                        className="
                          w-6 h-6 mt-1 rounded-full border-2 border-gray-400 bg-gray-100
                          checked:bg-blue-500 checked:border-blue-500
                          cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 shrink-0
                          appearance-none relative
                          before:content-[''] before:absolute before:top-1/2 before:left-1/2
                          before:w-2 before:h-4 before:border-l-2 before:border-b-2 before:border-white
                          before:-rotate-45 before:translate-x-[-50%] before:translate-y-[-50%]
                          before:opacity-0 checked:before:opacity-100 before:transition-opacity
                        "
                      />
                      <span
                        className={`block text-base font-semibold wrap-break-word whitespace-normal overflow-hidden text-ellipsis ${
                          t.done ? "line-through text-gray-400" : "text-gray-800"
                        }`}
                      >
                        {t.text}
                      </span>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => alert(`Editar tarefa: ${t.text}`)}
                        className="px-4 py-1 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-300 transition"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => key && onDelete(key, t.id)}
                        className="px-4 py-1 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-300 transition"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      t.done ? "max-h-0" : "max-h-40"
                    }`}
                  >
                    {t.description && (
                      <p
                        className="text-sm text-gray-600 mt-3 wrap-break-word whitespace-normal overflow-hidden leading-relaxed"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {t.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Botão de adicionar fixo */}
          {!showAddInputs ? (
            <div className="shrink-0 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowAddInputs(true)}
                className="flex my-2 items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full transition w-full"
              >
                <IconPlus /> Adicionar tarefa
              </button>
            </div>
          ) : (
            <div className="shrink-0 p-3 flex flex-col gap-2 border-t border-gray-200 bg-white">
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
