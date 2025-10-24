"use client";
import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { IconPlus } from "./IconButton";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

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
  onEditTask,
}: {
  date: Date;
  tasks: Record<string, Task[]>;
  onToggleDone: (dateKey: string, id: string) => void;
  onDelete: (dateKey: string, id: string) => void;
  onAddTask: (text: string, description?: string) => void;
  onEditTask: (id: string, text: string, description?: string) => void;
}) {
  const router = useRouter();
  const key = format(date, "yyyy-MM-dd");
  const list = tasks[key] || [];

  const [showAddInputs, setShowAddInputs] = useState(false);
  const [newText, setNewText] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSubmit = () => {
    if (!newText.trim()) return;

    if (editingTaskId) {
      onEditTask(editingTaskId, newText.trim(), newDescription.trim() || undefined);
    } else {
      onAddTask(newText.trim(), newDescription.trim() || undefined);
    }

    setNewText("");
    setNewDescription("");
    setShowAddInputs(false);
    setEditingTaskId(null);
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setNewText(task.text);
    setNewDescription(task.description || "");
    setShowAddInputs(true);
  };

  return (
    <aside className="flex flex-col bg-white shadow-md md:h-full max-h-full">
      {/* Cabeçalho com botão sair */}
      <div className="shrink-0 text-center text-4xl md:text-5xl font-bold text-white bg-blue-600 py-5 relative">
        <button
          onClick={handleLogout}
          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-400 text-white text-sm px-5 py-2 rounded-2xl transition"
        >
          Sair
        </button>

        <span className="text-6xl">{format(date, "d")}</span>
        <span className="block text-lg">{format(date, "MMMM yyyy")}</span>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-4">
        {list.length === 0 && (
          <div className="text-gray-500 text-sm text-center mt-4">Sem tarefas</div>
        )}

        <ul className="space-y-4">
          {list.map((t) => (
            <li
              key={t.id}
              className={`relative overflow-hidden px-4 py-3 rounded-xl shadow-sm w-full border border-gray-200 ${
                t.done ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <div
                className={`flex items-start justify-between gap-3 ${
                  t.description && !t.done ? "pb-2 border-b border-gray-200" : "pb-0"
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => onToggleDone(key, t.id)}
                    className="w-6 h-6 mt-1 rounded-full border-2 border-gray-400 bg-gray-100 checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 shrink-0"
                  />
                  <span className={`block text-base font-semibold ${t.done ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {t.text}
                  </span>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEditing(t)}
                    className="px-4 py-1 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-300 transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onDelete(key, t.id)}
                    className="px-4 py-1 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-300 transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {t.description && !t.done && (
                <div
                  ref={descRef}
                  className="overflow-hidden transition-[max-height] duration-300 ease-in-out max-h-40"
                >
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">{t.description}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Formulário */}
      {showAddInputs && (
        <div className="shrink-0 p-3 flex flex-col gap-2 border-t border-gray-200 bg-white">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Título da tarefa"
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 resize-none h-20"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white font-medium px-6 py-2 rounded-full"
            >
              {editingTaskId ? "Editar" : <><IconPlus /> Adicionar</>}
            </button>
            <button
              onClick={() => {
                setShowAddInputs(false);
                setEditingTaskId(null);
                setNewText("");
                setNewDescription("");
              }}
              className="flex-1 px-6 py-2 rounded-full border border-gray-300 text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {!showAddInputs && (
        <div className="shrink-0 p-4 border-t border-gray-200">
          <button
            onClick={() => setShowAddInputs(true)}
            className="flex my-2 items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full transition w-full"
          >
            <IconPlus /> Adicionar tarefa
          </button>
        </div>
      )}
    </aside>
  );
}
