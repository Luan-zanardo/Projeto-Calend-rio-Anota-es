"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getCalendarDays, nextMonth, prevMonth } from "@/lib/calendar";
import CalendarHeader from "@/components/CalendarHeader";
import CalendarGrid from "@/components/CalendarGrid";
import TaskPanel from "@/components/TaskPanel";
import BottomBar from "@/components/BottomBar";
import AddTaskModal from "@/components/AddTaskModal";
import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';

type Task = { id: string; text: string; done?: boolean };

export default function Page() {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [days, setDays] = useState<Date[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // inicializa somente no client
  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now);
    setSelectedDate(now);

    // carregar do localStorage (persistência local)
    const raw = localStorage.getItem("calendar_tasks_v1");
    if (raw) {
      try { setTasks(JSON.parse(raw)); } catch {}
    }
  }, []);

  // recalcula grade quando currentMonth muda
  useEffect(() => {
    if (!currentMonth) return;
    setDays(getCalendarDays(currentMonth));
  }, [currentMonth]);

  // salvar tasks localmente sempre que tasks muda
  useEffect(() => {
    localStorage.setItem("calendar_tasks_v1", JSON.stringify(tasks));
  }, [tasks]);

  const tasksByDateIso = useMemo(() => {
    // convenience map by yyyy-mm-dd
    const map: Record<string, Task[]> = {};
    Object.keys(tasks).forEach(k => {
      map[k] = tasks[k];
    });
    return map;
  }, [tasks]);

  // BACKEND: replace this with fetch to your API to load tasks from DB
  // example:
  // useEffect(() => { fetch('/api/tasks').then(r=>r.json()).then(setTasks) }, []);

  function handleCreateTask(text: string) {
    if (!selectedDate) return;
    const key = format(selectedDate, "yyyy-MM-dd");
    const newTask: Task = { id: uuidv4(), text, done: false };
    setTasks(prev => ({ ...prev, [key]: [...(prev[key] || []), newTask] }));

    // BACKEND: POST to /api/tasks to persist
    setShowAdd(false);
  }

  function toggleDone(dateKey: string, id: string) {
    setTasks(prev => {
      const list = (prev[dateKey] || []).map(t => t.id === id ? { ...t, done: !t.done } : t);
      const next = { ...prev, [dateKey]: list };
      // BACKEND: PATCH /api/tasks/:id
      return next;
    });
  }

  function deleteTask(dateKey: string, id: string) {
    setTasks(prev => {
      const list = (prev[dateKey] || []).filter(t => t.id !== id);
      const next = { ...prev, [dateKey]: list };
      // BACKEND: DELETE /api/tasks/:id
      return next;
    });
  }

  if (!currentMonth) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen p-6 bg-white flex gap-6">
      <div className="flex-1 bg-transparent">
        <div className="bg-black rounded-2xl p-6 shadow-lg">
          <CalendarHeader date={currentMonth} onPrev={() => setCurrentMonth(prevMonth(currentMonth))} onNext={() => setCurrentMonth(nextMonth(currentMonth))} />
          <CalendarGrid days={days} currentMonth={currentMonth} selectedDate={selectedDate} onSelect={setSelectedDate} tasksByDate={tasksByDateIso} />
          <div className="mt-6 flex justify-end">
            <BottomBar
              onAdd={() => setShowAdd(true)}
              onOpenAnalysis={() => setShowAnalysis(true)}
              onOpenSettings={() => setShowSettings(true)}
              onGotoMain={() => {
                // em app single page, já estamos na principal — se quiser, reseta para agora
                setCurrentMonth(new Date());
                setSelectedDate(new Date());
              }}
            />
          </div>
        </div>
      </div>

      <TaskPanel date={selectedDate} tasks={tasks} onToggleDone={toggleDone} onDelete={deleteTask} />

      <AddTaskModal open={showAdd} onClose={()=>setShowAdd(false)} onCreate={handleCreateTask} date={selectedDate} />

      {/* Análise Modal simples */}
      {showAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-bold mb-3">Análise de tarefas</h3>
            <p className="text-sm text-gray-600 mb-3">Resumo rápido:</p>
            <div className="space-y-2">
              {Object.entries(tasks).map(([date, list]) => {
                const done = list.filter(t=>t.done).length;
                return (
                  <div key={date} className="flex justify-between text-sm">
                    <div>{date}</div>
                    <div>{done}/{list.length} concluídas</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={()=>setShowAnalysis(false)} className="px-3 py-1 rounded border">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-bold mb-3">Configurações</h3>
            <p className="text-sm text-gray-600">Aqui você pode trocar cores do calendário (demo).</p>
            <div className="mt-3">
              <button onClick={()=>{ document.documentElement.style.setProperty('--card-bg','#efefef'); setShowSettings(false); }} className="px-3 py-1 mr-2 border rounded">Claro</button>
              <button onClick={()=>{ document.documentElement.style.setProperty('--card-bg','#1f2937'); setShowSettings(false); }} className="px-3 py-1 border rounded">Escuro</button>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={()=>setShowSettings(false)} className="px-3 py-1 rounded border">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}