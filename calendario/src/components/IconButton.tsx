"use client";
import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "filled" | "outline";
};

export default function IconButton({ size="md", variant="ghost", className, children, ...rest }: Props) {
  const sizeCls = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const variantCls =
    variant === "filled" ? "bg-gray-200 hover:bg-gray-300" :
    variant === "outline" ? "bg-white border border-gray-200" : "bg-transparent hover:bg-gray-100";

  return (
    <button
      className={clsx("inline-flex items-center justify-center rounded-full", sizeCls, variantCls, "transition", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/* small icons */
export const IconCalendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M16 3v4M8 3v4" />
  </svg>
);
export const IconPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconChart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M3 3v18h18" /><path d="M7 13l3-3 4 5 5-9" />
  </svg>
);
export const IconGear = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
    <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82" />
  </svg>
);