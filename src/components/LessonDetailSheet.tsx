"use client";

import React, { useState } from "react";
import { Lesson } from "@/data/types";
import {
  X,
  CheckCircle2,
  Brain,
  Code2,
  Sparkles,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";

interface LessonDetailSheetProps {
  lesson: Lesson | null;
  onClose: () => void;
  onTryInSandbox: (code: string, type: "js" | "dom" | "node" | "telegram" | "security") => void;
  onLessonCompleted: (lessonId: string, score: number) => void;
}

export const LessonDetailSheet: React.FC<LessonDetailSheetProps> = ({
  lesson,
  onClose,
  onTryInSandbox,
  onLessonCompleted,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!lesson) return null;

  const handleAnswerClick = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);

    const isCorrect =
      selectedAnswer === lesson.quiz[0]?.correctIndex;

    if (isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore offline canvas errors
      }
      onLessonCompleted(lesson.id, 100);
    } else {
      onLessonCompleted(lesson.id, 50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-[#0e1422] border-t sm:border border-slate-700/80 w-full max-w-3xl max-h-[92vh] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* iOS Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-[#090d16]/60">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              {lesson.categoryTitle}
            </span>
            <span className="text-xs text-slate-400">
              {lesson.level} • {lesson.readTimeMinutes} min read
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Title & Subtitle */}
          <div>
            <h2 className="text-2xl font-extrabold text-white leading-tight">
              {lesson.title}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              {lesson.subtitle}
            </p>
          </div>

          {/* W3Schools "Try It Yourself" Minimal Summary Card */}
          <div className="bg-[#131c2e] border-l-4 border-emerald-400 p-4 rounded-r-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                W3Schools Summary
              </span>
              <button
                onClick={() =>
                  onTryInSandbox(lesson.sandboxCode, lesson.sandboxType)
                }
                className="bg-emerald-500 hover:bg-emerald-400 text-[#090d16] font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all shadow-sm"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Try it Yourself</span>
              </button>
            </div>
            <ul className="text-sm text-slate-200 space-y-1.5 list-disc list-inside">
              {lesson.w3sSummary.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Syntax Reference Table */}
          {lesson.syntaxTable && lesson.syntaxTable.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center">
                <BookOpen className="w-4 h-4 mr-1.5 text-emerald-400" />
                <span>Syntax Reference</span>
              </h3>
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-3 bg-slate-900/80 p-2.5 font-bold text-slate-400 border-b border-slate-800">
                  <div>Syntax</div>
                  <div>Description</div>
                  <div>Example</div>
                </div>
                {lesson.syntaxTable.map((syn, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 p-2.5 border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30 font-mono text-slate-200"
                  >
                    <div className="text-emerald-300 font-bold">
                      {syn.syntax}
                    </div>
                    <div className="text-slate-300 font-sans">
                      {syn.description}
                    </div>
                    <div className="text-slate-400">{syn.example}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deep Dive Content */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Deep Dive & Architecture
            </h3>
            <div className="prose prose-invert prose-sm max-w-none bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 text-slate-300 leading-relaxed font-sans">
              <pre className="whitespace-pre-wrap font-mono text-xs bg-black/40 p-3 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto">
                {lesson.deepDiveMarkdown}
              </pre>
            </div>
          </div>

          {/* Neuroscience Memory Anchor Card (Active Recall / Feynman Prompt) */}
          <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Neuroscience Memory Anchor
                </span>
              </div>
              <span className="text-[10px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded font-mono font-bold">
                Leitner Level {lesson.memoryAnchor.leitnerLevel}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {lesson.memoryAnchor.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lesson.memoryAnchor.neuroScienceTip}
            </p>
            <div className="bg-black/30 p-2.5 rounded-lg border border-purple-500/20 mt-2">
              <span className="text-[11px] font-bold text-purple-400 block mb-1">
                🗣️ Feynman Self-Test Prompt:
              </span>
              <p className="text-xs text-slate-200 italic">
                &ldquo;{lesson.memoryAnchor.feynmanPrompt}&rdquo;
              </p>
            </div>
          </div>

          {/* Interactive Quiz Checkpoint */}
          {lesson.quiz && lesson.quiz[0] && (
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-1.5 text-amber-400" />
                  <span>Memory Checkpoint Quiz</span>
                </span>
                {quizSubmitted && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedAnswer === lesson.quiz[0].correctIndex
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {selectedAnswer === lesson.quiz[0].correctIndex
                      ? "✓ Correct (+100 XP)"
                      : "✕ Review Concept"}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-white">
                {lesson.quiz[0].question}
              </p>

              <div className="space-y-2">
                {lesson.quiz[0].options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === lesson.quiz[0].correctIndex;

                  let btnStyle =
                    "bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800";
                  if (quizSubmitted) {
                    if (isCorrect) {
                      btnStyle =
                        "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold";
                    } else if (isSelected && !isCorrect) {
                      btnStyle =
                        "bg-rose-950/60 border-rose-500 text-rose-300";
                    }
                  } else if (isSelected) {
                    btnStyle =
                      "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerClick(idx)}
                      disabled={quizSubmitted}
                      className={`w-full text-left text-xs p-3 rounded-xl border transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={selectedAnswer === null}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-[#090d16] font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Submit Answer
                </button>
              ) : (
                <div className="text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-slate-300">
                  <strong className="text-emerald-400">Explanation: </strong>
                  {lesson.quiz[0].explanation}
                </div>
              )}
            </div>
          )}

          {/* Project Spec Section if present */}
          {lesson.project && (
            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Included Mini-Project
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  {lesson.project.difficulty}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                {lesson.project.title}
              </h4>
              <p className="text-xs text-slate-300">
                {lesson.project.description}
              </p>
              <button
                onClick={() =>
                  onTryInSandbox(
                    lesson.project!.code,
                    lesson.project!.sandboxType
                  )
                }
                className="bg-emerald-500 hover:bg-emerald-400 text-[#090d16] font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-md"
              >
                <Code2 className="w-4 h-4" />
                <span>Open Project in Sandbox</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090d16]/90 flex items-center justify-between">
          <button
            onClick={() =>
              onTryInSandbox(lesson.sandboxCode, lesson.sandboxType)
            }
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#090d16] font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 mr-2"
          >
            <Code2 className="w-4 h-4" />
            <span>Open in Sandbox</span>
          </button>
          <button
            onClick={() => {
              onLessonCompleted(lesson.id, 100);
              onClose();
            }}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all"
          >
            Mark Done ✓
          </button>
        </div>
      </div>
    </div>
  );
};
