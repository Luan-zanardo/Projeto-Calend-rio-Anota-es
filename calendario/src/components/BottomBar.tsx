"use client";
import React from "react";
import IconButton, { IconCalendar, IconPlus, IconChart, IconGear } from "./IconButton";

export default function BottomBar({ onAdd, onOpenAnalysis, onOpenSettings, onGotoMain }: any) {
  return (
    <div className="mt-4 flex gap-3 items-center">
      <IconButton title="Principal" variant="outline" onClick={onGotoMain}><IconCalendar/></IconButton>
      <IconButton title="Adicionar" variant="filled" onClick={onAdd}><IconPlus/></IconButton>
      <IconButton title="Análise" variant="ghost" onClick={onOpenAnalysis}><IconChart/></IconButton>
      <IconButton title="Configurações" variant="ghost" onClick={onOpenSettings}><IconGear/></IconButton>
    </div>
  );
}