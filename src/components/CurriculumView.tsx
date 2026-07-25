"use client";

import React, { useState } from "react";
import { ALL_LESSONS, CURRICULUM_CATEGORIES } from "@/data/curriculum";
import { Lesson, LessonCategory } from "@/data/types";
import {
  Search,
  BookOpen,
  Code2,
  CheckCircle2,
  ChevronRight,
  Brain,
  Sparkles,
  Award,
} from "lucide-react";

interface CurriculumViewProps {
  completedIds: string[];
  onSelectLesson: (lesson: Lesson) => void;
  onOpenSandboxWithLesson: (lesson: Lesson) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  completedIds,
  onSelectLesson,
  onOpenSandboxWithLesson,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<LessonCategory | "all">("js-core");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLessons = ALL_LESSONS.filter((lesson) => {
    const matchesCat =
      selectedCategory === "all" || lesson.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.deepDiveMarkdown
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-8">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 20+ lessons, ES2026 syntax, DOM, or Telegram bot code..."
          className="w-full bg-[#0e1422] border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 shadow-lg placeholder:text-slate-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills (W3Schools mobile style) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CURRICULUM_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchQuery("");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-2 ${
                isSelected
                  ? "bg-emerald-500 text-[#090d16] border-emerald-400 shadow-lg shadow-emerald-500/20 scale-100"
                  : "bg-[#0e1422] text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              <span>{cat.title}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected
                    ? "bg-black/20 text-[#090d16]"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {cat.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Header Hero */}
      {selectedCategory && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e1422] border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-white">
              {
                CURRICULUM_CATEGORIES.find((c) => c.id === selectedCategory)
                  ?.title
              }
            </h2>
            <p className="text-xs text-slate-300">
              {
                CURRICULUM_CATEGORIES.find((c) => c.id === selectedCategory)
                  ?.description
              }
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-300 text-xs font-mono">
            <Award className="w-4 h-4 mr-1" />
            <span>W3Schools Complete</span>
          </div>
        </div>
      )}

      {/* Lesson Cards List */}
      <div className="space-y-3">
        {filteredLessons.length === 0 ? (
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Lessons Found</h3>
            <p className="text-xs text-slate-400">
              Try a different keyword or switch to another category tab above.
            </p>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const isCompleted = completedIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className="group bg-[#0e1422] hover:bg-[#131b2e] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all cursor-pointer shadow-md flex items-center justify-between"
              >
                <div className="flex items-start space-x-3.5 pr-3">
                  {/* Status Indicator / Checkbox */}
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-emerald-400 flex-shrink-0 transition-all" />
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {lesson.title}
                      </h3>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {lesson.level}
                      </span>
                      {lesson.project && (
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono border border-teal-500/30">
                          + Project
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      {lesson.subtitle}
                    </p>

                    {/* Neuroscience Leitner Badge */}
                    <div className="flex items-center space-x-3 pt-1">
                      <span className="text-[10px] text-purple-300 flex items-center">
                        <Brain className="w-3 h-3 mr-1 text-purple-400" />
                        <span>
                          Leitner Box {lesson.memoryAnchor.leitnerLevel}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {lesson.readTimeMinutes} min read
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action: Try It button or Arrow */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSandboxWithLesson(lesson);
                    }}
                    className="hidden sm:flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-[#090d16] font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-500/30 transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Try It</span>
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
