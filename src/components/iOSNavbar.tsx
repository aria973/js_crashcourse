"use client";

import React from "react";
import {
  Code2,
  Wifi,
  WifiOff,
  ShieldCheck,
  Award,
  BookOpen,
} from "lucide-react";

interface IOSNavbarProps {
  isOffline: boolean;
  completedCount: number;
  totalLessons: number;
  memoryStrengthAvg: number;
  onOpenSandbox: () => void;
}

export const IOSNavbar: React.FC<IOSNavbarProps> = ({
  isOffline,
  completedCount,
  totalLessons,
  memoryStrengthAvg,
  onOpenSandbox,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-emerald-500/20 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Logo & Apple W3Schools App Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-[#090d16] font-extrabold text-lg">
            JS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-white font-bold text-base md:text-lg tracking-tight">
                W3S <span className="text-emerald-400">JS Hero</span>
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                PWA iOS
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5">
              <span>Zero to NSA Level</span>
              <span>•</span>
              <span className="flex items-center text-emerald-400">
                {isOffline ? (
                  <>
                    <WifiOff className="w-3 h-3 mr-1 text-amber-400" />
                    <span className="text-amber-400 font-medium">Offline PWA</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    <span>Online Sync</span>
                  </>
                )}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Neuro Memory Progress Badge & Quick Sandbox */}
        <div className="flex items-center space-x-2">
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center bg-slate-800/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs">
            <Award className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <span className="text-slate-300 font-medium">
              {completedCount}/{totalLessons} Lessons
            </span>
            <span className="mx-1.5 text-slate-600">|</span>
            <span className="text-emerald-300 font-mono">
              {Math.round(memoryStrengthAvg)}% Memory
            </span>
          </div>

          {/* Try It Yourself Quick Button */}
          <button
            onClick={onOpenSandbox}
            className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#090d16] font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Try Sandbox</span>
          </button>
        </div>
      </div>
    </header>
  );
};
