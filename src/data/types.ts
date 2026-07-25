export type LessonCategory =
  | "js-core"
  | "dom-web"
  | "async-js"
  | "nodejs"
  | "telegram-bots"
  | "nsa-security";

export interface MemoryAnchor {
  title: string;
  neuroScienceTip: string;
  feynmanPrompt: string;
  leitnerLevel: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SyntaxItem {
  syntax: string;
  description: string;
  example: string;
}

export interface ProjectSpec {
  id: string;
  title: string;
  category: LessonCategory;
  difficulty: "Simple" | "Intermediate" | "Advanced" | "NSA Level";
  description: string;
  features: string[];
  code: string;
  explanation: string;
  sandboxType: "js" | "dom" | "node" | "telegram" | "security";
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  category: LessonCategory;
  categoryTitle: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Master / NSA";
  readTimeMinutes: number;
  w3sSummary: string[];
  syntaxTable: SyntaxItem[];
  deepDiveMarkdown: string;
  memoryAnchor: MemoryAnchor;
  quiz: QuizQuestion[];
  sandboxCode: string;
  sandboxType: "js" | "dom" | "node" | "telegram" | "security";
  project?: ProjectSpec;
}
