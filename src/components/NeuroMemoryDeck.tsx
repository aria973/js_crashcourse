"use client";

import React, { useState } from "react";
import { ALL_LESSONS } from "@/data/curriculum";
import { Lesson } from "@/data/types";
import {
  Brain,
  Sparkles,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import confetti from "canvas-confetti";

interface NeuroMemoryDeckProps {
  onUpdateLessonMemory: (lessonId: string, newBox: number, newStrength: number) => void;
  completedIds: string[];
}

export const NeuroMemoryDeck: React.FC<NeuroMemoryDeckProps> = ({
  onUpdateLessonMemory,
  completedIds,
}) => {
  const [activeBox, setActiveBox] = useState<number>(1);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filter lessons by their default or updated Leitner box level
  const lessonsInBox = ALL_LESSONS.filter(
    (l) => l.memoryAnchor.leitnerLevel === activeBox
  );

  const currentLesson: Lesson | undefined = lessonsInBox[cardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    if (cardIndex < lessonsInBox.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    } else {
      setCardIndex(lessonsInBox.length - 1);
    }
  };

  const handleRecallRating = (success: boolean) => {
    if (!currentLesson) return;

    let nextBox = activeBox;
    if (success) {
      nextBox = Math.min(5, activeBox + 1);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore offline errors
      }
    } else {
      nextBox = Math.max(1, activeBox - 1);
    }

    const newStrength = Math.min(100, nextBox * 20);
    onUpdateLessonMemory(currentLesson.id, nextBox, newStrength);
    handleNextCard();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 rounded-2xl p-5 space-y-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Neuroscience Memory & Active Recall
            </h2>
            <p className="text-xs text-slate-300">
              Leitner Spaced Repetition (Boxes 1 to 5) • Feynman Technique • Neural Retention
            </p>
          </div>
        </div>
      </div>

      {/* Leitner Box Selector Bar */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((boxNum) => {
          const isSelected = activeBox === boxNum;
          const count = ALL_LESSONS.filter(
            (l) => l.memoryAnchor.leitnerLevel === boxNum
          ).length;

          return (
            <button
              key={boxNum}
              onClick={() => {
                setActiveBox(boxNum);
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className={`p-3 rounded-xl border text-center transition-all ${
                isSelected
                  ? "bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/20"
                  : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              <span className="text-xs font-bold block">Box {boxNum}</span>
              <span className="text-[10px] opacity-80 block mt-0.5">
                {count} {count === 1 ? "Card" : "Cards"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card Display Area */}
      {lessonsInBox.length === 0 ? (
        <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <Brain className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">
            No Flashcards in Box {activeBox} Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Review cards in other boxes or complete lessons in the curriculum to populate your spaced repetition deck!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Flashcard Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer group relative bg-gradient-to-b from-[#131b2e] to-[#0e1422] border-2 border-slate-700 hover:border-purple-500/50 rounded-2xl p-6 min-h-[300px] flex flex-col justify-between transition-all shadow-xl"
          >
            {/* Card Header Info */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                {currentLesson?.categoryTitle} • Card {cardIndex + 1} of{" "}
                {lessonsInBox.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center">
                <RotateCw className="w-3.5 h-3.5 mr-1" />
                <span>Tap anywhere to flip</span>
              </span>
            </div>

            {/* Card Content Area (Front vs Back) */}
            <div className="my-auto py-6 space-y-4">
              {!isFlipped ? (
                <div className="space-y-3 text-center">
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                    Feynman Recall Challenge
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {currentLesson?.title}
                  </h3>
                  <div className="bg-black/30 border border-purple-500/20 p-4 rounded-xl max-w-lg mx-auto">
                    <p className="text-sm text-slate-200 italic leading-relaxed">
                      &ldquo;{currentLesson?.memoryAnchor.feynmanPrompt}&rdquo;
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    Try to explain this aloud or mentally before tapping to reveal the answer!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-emerald-400">
                      ✅ Core Memory Anchor: {currentLesson?.memoryAnchor.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    {currentLesson?.memoryAnchor.neuroScienceTip}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      W3Schools Summary Points:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {currentLesson?.w3sSummary.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {currentLesson?.syntaxTable && currentLesson.syntaxTable[0] && (
                    <div className="bg-black/50 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
                      <strong>Syntax: </strong>
                      {currentLesson.syntaxTable[0].syntax}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
              <span>Memory Strength: {activeBox * 20}%</span>
              <span>Leitner Spaced Repetition Box {activeBox}</span>
            </div>
          </div>

          {/* Controls & Recall Self-Assessment Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={handlePrevCard}
                className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={handleNextCard}
                className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => handleRecallRating(false)}
                className="flex-1 sm:flex-none bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1 transition-all"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Need Review (Demote)</span>
              </button>
              <button
                onClick={() => handleRecallRating(true)}
                className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-400 text-[#090d16] font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center space-x-1 transition-all shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recalled Well (Promote!)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
