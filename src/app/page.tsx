"use client";

import React, { useState, useEffect } from "react";
import { IOSNavbar } from "@/components/iOSNavbar";
import { IOSBottomTabs, ActiveTab } from "@/components/iOSBottomTabs";
import { CurriculumView } from "@/components/CurriculumView";
import { LessonDetailSheet } from "@/components/LessonDetailSheet";
import { TelegramBotSimulator } from "@/components/TelegramBotSimulator";
import { NeuroMemoryDeck } from "@/components/NeuroMemoryDeck";
import { W3SchoolsSandbox } from "@/components/W3SchoolsSandbox";
import { NSASecurityVault } from "@/components/NSASecurityVault";
import { ALL_LESSONS } from "@/data/curriculum";
import { Lesson } from "@/data/types";
import {
  Sparkles,
  BookOpen,
  Bot,
  Brain,
  Code2,
  ShieldAlert,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("curriculum");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [memoryStrengthAvg, setMemoryStrengthAvg] = useState<number>(45);

  // Sandbox active snippet override
  const [sandboxCode, setSandboxCode] = useState<string>(
    ALL_LESSONS[0].sandboxCode
  );
  const [sandboxType, setSandboxType] = useState<
    "js" | "dom" | "node" | "telegram" | "security"
  >("js");

  // 1. Service Worker Registration & Online/Offline Monitor
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Register Service Worker for PWA
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => console.log("[PWA ServiceWorker] Registered successfully"))
          .catch((err) => console.warn("[PWA ServiceWorker] Registration failed:", err));
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // 2. Fetch Initial Progress from PostgreSQL
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("/api/progress");
        const data = await res.json();
        if (data && data.data && Array.isArray(data.data)) {
          const ids = data.data
            .filter((row: any) => row.completed)
            .map((row: any) => row.lessonId);
          setCompletedIds(ids);

          if (data.data.length > 0) {
            const avg =
              data.data.reduce(
                (sum: number, r: any) => sum + (r.memoryStrength || 40),
                0
              ) / data.data.length;
            setMemoryStrengthAvg(avg);
          }
        }
      } catch (err) {
        console.warn("Offline mode: using local cached progress state");
      }
    }
    loadProgress();
  }, []);

  // 3. Mark Lesson Complete & Promote Memory
  const handleLessonCompleted = async (lessonId: string, score: number) => {
    if (!completedIds.includes(lessonId)) {
      setCompletedIds((prev) => [...prev, lessonId]);
    }

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          completed: true,
          quizScore: score,
          leitnerBox: 3,
          memoryStrength: score,
        }),
      });
    } catch (err) {
      // Offline fallback
    }
  };

  const handleUpdateLessonMemory = async (
    lessonId: string,
    newBox: number,
    newStrength: number
  ) => {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          completed: true,
          leitnerBox: newBox,
          memoryStrength: newStrength,
        }),
      });
      setMemoryStrengthAvg((prev) =>
        Math.min(100, Math.round((prev + newStrength) / 2))
      );
    } catch (err) {
      // Offline fallback
    }
  };

  // 4. Try It Yourself in Sandbox Handler
  const handleTryInSandbox = (
    code: string,
    type: "js" | "dom" | "node" | "telegram" | "security"
  ) => {
    setSandboxCode(code);
    setSandboxType(type);
    setSelectedLesson(null);
    setActiveTab("sandbox");
  };

  const handleSaveSnippet = async (
    title: string,
    category: string,
    code: string
  ) => {
    try {
      await fetch("/api/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, code }),
      });
      alert(`✅ Saved "${title}" to your PostgreSQL sandbox library!`);
    } catch (e) {
      alert("Offline mode: snippet kept in session memory!");
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-[#090d16]">
      {/* iOS W3Schools Top Bar */}
      <IOSNavbar
        isOffline={isOffline}
        completedCount={completedIds.length}
        totalLessons={ALL_LESSONS.length}
        memoryStrengthAvg={memoryStrengthAvg}
        onOpenSandbox={() => setActiveTab("sandbox")}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-4 pb-28">
        {/* TAB 1: CURRICULUM LESSONS (W3Schools mobile layout) */}
        {activeTab === "curriculum" && (
          <CurriculumView
            completedIds={completedIds}
            onSelectLesson={(lesson) => setSelectedLesson(lesson)}
            onOpenSandboxWithLesson={(lesson) =>
              handleTryInSandbox(lesson.sandboxCode, lesson.sandboxType)
            }
          />
        )}

        {/* TAB 2: TELEGRAM BOT PROJECTS (5 Simple to Advanced + Telegraf) */}
        {activeTab === "bot-projects" && (
          <TelegramBotSimulator
            onOpenInSandbox={(code, type) => handleTryInSandbox(code, type)}
          />
        )}

        {/* TAB 3: NEUROSCIENCE & ACTIVE RECALL (Leitner Boxes 1-5 + Feynman) */}
        {activeTab === "neuro-memory" && (
          <NeuroMemoryDeck
            completedIds={completedIds}
            onUpdateLessonMemory={handleUpdateLessonMemory}
          />
        )}

        {/* TAB 4: CODE SANDBOX (Interactive JS, DOM, Node, Telegram, Security) */}
        {activeTab === "sandbox" && (
          <W3SchoolsSandbox
            initialCode={sandboxCode}
            initialType={sandboxType}
            onSaveSnippet={handleSaveSnippet}
          />
        )}

        {/* TAB 5: NSA SECURITY VAULT (OWASP Top 10, HMAC, AES-GCM, Timing-Safe) */}
        {activeTab === "nsa-vault" && (
          <NSASecurityVault
            onOpenInSandbox={(code, type) => handleTryInSandbox(code, type)}
          />
        )}
      </main>

      {/* iOS Bottom Navigation Bar */}
      <IOSBottomTabs
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
      />

      {/* iOS Native Modal Sheet for Lesson & Syntax Reference Details */}
      <LessonDetailSheet
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
        onTryInSandbox={(code, type) => handleTryInSandbox(code, type)}
        onLessonCompleted={handleLessonCompleted}
      />
    </div>
  );
}
