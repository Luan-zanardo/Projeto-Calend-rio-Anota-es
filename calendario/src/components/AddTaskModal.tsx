"use client";
import React, { useState } from "react";

export default function AddTaskModal({ open, onClose, onCreate, date }: any) {
  const [text, setText] = useState("");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="text-lg font-bold mb-2">Adicionar tarefa — {date ? date.toDateString() : ""}</h3>
        <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full h-28 p-2 border rounded mb-3" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border">Cancelar</button>
          <button onClick={()=>{
            if(!text.trim()) return;
            onCreate(text.trim());
            setText("");
          }} className="px-4 py-1 rounded bg-blue-500 text-white">Adicionar</button>
        </div>
      </div>
    </div>
  );
}