"use client";

import React from "react";
import {
  BookOpen,
  Bot,
  Brain,
  Code2,
  ShieldAlert,
} from "lucide-react";

export type ActiveTab =
  | "curriculum"
  | "bot-projects"
  | "neuro-memory"
  | "sandbox"
  | "nsa-vault";

interface IOSBottomTabsProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const IOSBottomTabs: React.FC<IOSBottomTabsProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    {
      id: "curriculum" as ActiveTab,
      label: "W3S Lessons",
      icon: BookOpen,
      badge: "20+",
    },
    {
      id: "bot-projects" as ActiveTab,
      label: "Telegram Bots",
      icon: Bot,
      badge: "5 Proj",
    },
    {
      id: "neuro-memory" as ActiveTab,
      label: "Neuro Recall",
      icon: Brain,
      badge: "Leitner",
    },
    {
      id: "sandbox" as ActiveTab,
      label: "Code Sandbox",
      icon: Code2,
      badge: "Try It",
    },
    {
      id: "nsa-vault" as ActiveTab,
      label: "NSA Security",
      icon: ShieldAlert,
      badge: "Level 5",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800/80 pb-safe">
      <div className="max-w-4xl mx-auto flex items-center justify-around py-1.5 px-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onChangeTab(t.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all relative ${
                isActive
                  ? "text-emerald-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                {t.badge && (
                  <span className="absolute -top-1.5 -right-3.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold px-1 py-0.2 rounded-full border border-emerald-500/40">
                    {t.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {t.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
