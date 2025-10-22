"use client";
import React, { useEffect, useState } from "react";
import { getCalendarDays, nextMonth, prevMonth } from "@/lib/calendar";
import CalendarHeader from "@/components/CalendarHeader";
import CalendarGrid from "@/components/CalendarGrid";
import TaskPanel, { Task } from "@/components/TaskPanel";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [days, setDays] = useState<Date[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});

  // Inicializa mês e carrega tarefas do localStorage
  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now);
    setSelectedDate(now);

    const raw = localStorage.getItem("calendar_tasks_v1");
    if (raw) {
      try {
        setTasks(JSON.parse(raw));
      } catch {
        console.error("Erro ao carregar tarefas");
      }
    }
  }, []);

  // Atualiza dias quando o mês muda
  useEffect(() => {
    if (!currentMonth) return;
    setDays(getCalendarDays(currentMonth));
  }, [currentMonth]);

  // Salva tarefas no localStorage
  useEffect(() => {
    localStorage.setItem("calendar_tasks_v1", JSON.stringify(tasks));
  }, [tasks]);

  // Adiciona tarefa
  const handleAddTask = (text: string, description?: string) => {
    if (!selectedDate) return;
    const key = format(selectedDate, "yyyy-MM-dd");
    const newTask: Task = { id: uuidv4(), text, description, done: false };
    setTasks((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newTask],
    }));
  };

  // Alterna tarefa feita/não feita
  const handleToggleDone = (dateKey: string, id: string) => {
    setTasks((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    }));
  };

  // Deleta tarefa
  const handleDelete = (dateKey: string, id: string) => {
    setTasks((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((t) => t.id !== id),
    }));
  };

  if (!currentMonth)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden bg-black">
      {/* Calendário */}
      <div className="md:basis-[80%] flex-1 flex flex-col bg-white shadow-lg overflow-hidden p-6">
        <CalendarHeader
          date={currentMonth}
          onPrev={() => setCurrentMonth(prevMonth(currentMonth))}
          onNext={() => setCurrentMonth(nextMonth(currentMonth))}
        />
        <div className="flex-1 flex flex-col">
          <CalendarGrid
            days={days}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            tasksByDate={tasks}
          />
        </div>
      </div>

      {/* Painel de tarefas */}
      <div className="md:basis-[20%] w-full md:w-auto h-[35vh] md:h-full flex flex-col bg-white rounded-t-2xl md:rounded-none md:rounded-r-2xl shadow-lg">
        <TaskPanel
          date={selectedDate}
          tasks={tasks}
          onToggleDone={handleToggleDone}
          onDelete={handleDelete}
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );
}
