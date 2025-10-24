"use client";
import React, { useEffect, useState } from "react";
import { getCalendarDays, nextMonth, prevMonth } from "@/lib/calendar";
import CalendarHeader from "@/components/CalendarHeader";
import CalendarGrid from "@/components/CalendarGrid";
import TaskPanel, { Task } from "@/components/TaskPanel";
import { format } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});

  // Checa usuário e carrega tarefas
  useEffect(() => {
    const loadTasks = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Erro ao carregar tarefas:", error);
        return;
      }

      const tasksByDate: Record<string, Task[]> = {};
      data.forEach((t: any) => {
        const key = format(new Date(t.date), "yyyy-MM-dd");
        if (!tasksByDate[key]) tasksByDate[key] = [];
        tasksByDate[key].push({
          id: t.id,
          text: t.text,
          description: t.description,
          done: t.done,
        });
      });

      setTasks(tasksByDate);
    };

    loadTasks();
  }, [router]);

  // Gera dias do calendário
  useEffect(() => {
    setDays(getCalendarDays(currentMonth));
  }, [currentMonth]);

  // Adicionar tarefa
  const handleAddTask = async (text: string, description?: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ user_id: userId, date: selectedDate, text, description, done: false }])
      .select();

    if (error) return;

    const key = format(selectedDate, "yyyy-MM-dd");
    setTasks((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), data![0]],
    }));
  };

  // Editar
  const handleEditTask = async (id: string, text: string, description?: string) => {
    const key = format(selectedDate, "yyyy-MM-dd");

    await supabase.from("tasks").update({ text, description }).eq("id", id);

    setTasks((prev) => ({
      ...prev,
      [key]: prev[key].map((t) => (t.id === id ? { ...t, text, description } : t)),
    }));
  };

  // Toggle concluída
  const handleToggleDone = async (dateKey: string, id: string) => {
    const task = tasks[dateKey].find((t) => t.id === id);
    if (!task) return;

    await supabase.from("tasks").update({ done: !task.done }).eq("id", id);

    setTasks((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    }));
  };

  // Delete
  const handleDelete = async (dateKey: string, id: string) => {
    await supabase.from("tasks").delete().eq("id", id);

    setTasks((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((t) => t.id !== id),
    }));
  };

  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row bg-black">
      {/* Calendário */}
      <div className="md:basis-[75%] flex-1 flex flex-col bg-white shadow-lg overflow-hidden">
        <CalendarHeader
          date={currentMonth}
          onPrev={() => setCurrentMonth(prevMonth(currentMonth))}
          onNext={() => setCurrentMonth(nextMonth(currentMonth))}
        />

        <div className="flex-1 flex flex-col m-5 overflow-hidden">
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
      <div className="md:basis-[25%] h-screen w-full md:w-auto flex flex-col bg-white shadow-lg md:h-screen">
        <TaskPanel
          date={selectedDate}
          tasks={tasks}
          onToggleDone={handleToggleDone}
          onDelete={handleDelete}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
        />
      </div>
    </div>
  );
}
