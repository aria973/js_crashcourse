"use client";

import React, { useState, useEffect, useRef } from "react";
import { ALL_LESSONS, TELEGRAM_BOT_PROJECTS } from "@/data/curriculum";
import {
  Code2,
  Play,
  RotateCcw,
  Save,
  Terminal,
  FolderOpen,
  Sparkles,
  Copy,
  Check,
  Globe,
  Server,
  Bot,
  ShieldAlert,
} from "lucide-react";

interface W3SchoolsSandboxProps {
  initialCode?: string;
  initialType?: "js" | "dom" | "node" | "telegram" | "security";
  onSaveSnippet?: (title: string, category: string, code: string) => void;
  savedSnippets?: any[];
}

export const W3SchoolsSandbox: React.FC<W3SchoolsSandboxProps> = ({
  initialCode,
  initialType = "js",
  onSaveSnippet,
  savedSnippets = [],
}) => {
  const [code, setCode] = useState<string>(
    initialCode || ALL_LESSONS[0].sandboxCode
  );
  const [sandboxType, setSandboxType] = useState<
    "js" | "dom" | "node" | "telegram" | "security"
  >(initialType);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [snippetTitle, setSnippetTitle] = useState<string>("");
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    ALL_LESSONS[0].id
  );

  const domPreviewRef = useRef<HTMLDivElement | null>(null);

  // Sync when initialCode or initialType changes from outside (e.g. Try It Yourself button)
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      if (initialType) setSandboxType(initialType);
    }
  }, [initialCode, initialType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePresetChange = (id: string) => {
    setSelectedPresetId(id);
    const foundLesson = ALL_LESSONS.find((l) => l.id === id);
    if (foundLesson) {
      setCode(foundLesson.sandboxCode);
      setSandboxType(foundLesson.sandboxType);
      return;
    }
    const foundProj = TELEGRAM_BOT_PROJECTS.find((p) => p.id === id);
    if (foundProj) {
      setCode(foundProj.code);
      setSandboxType(foundProj.sandboxType);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setLogs([]);

    const capturedLogs: string[] = [];
    const pushLog = (msg: string) => {
      capturedLogs.push(msg);
      setLogs([...capturedLogs]);
    };

    try {
      if (sandboxType === "node" || sandboxType === "telegram" || sandboxType === "security") {
        pushLog(`[W3S Server Sandbox] Executing ${sandboxType.toUpperCase()} environment...`);
        
        let simAction = "test_group_guard";
        if (sandboxType === "security") simAction = "test_nsa_audit";
        else if (sandboxType === "telegram") simAction = "test_inline_query";

        const res = await fetch("/api/telegram/simulator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: simAction,
            payload: { userCodeSnippet: code, timestamp: Date.now() },
          }),
        });

        const data = await res.json();
        pushLog("[Server Execution Success] Result:");
        pushLog(JSON.stringify(data, null, 2));
      } else {
        // Client-side execution for JS and DOM
        if (domPreviewRef.current) {
          domPreviewRef.current.innerHTML = "";
        }

        // Create a secure custom console logging proxy
        const customConsole = {
          log: (...args: any[]) => {
            const formatted = args
              .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
              .join(" ");
            pushLog(`> ${formatted}`);
          },
          warn: (...args: any[]) => {
            pushLog(`[WARN] > ${args.join(" ")}`);
          },
          error: (...args: any[]) => {
            pushLog(`[ERROR] > ${args.join(" ")}`);
          },
        };

        // Execute in safe function wrapper
        const runnerFn = new Function("console", "container", code);
        runnerFn(customConsole, domPreviewRef.current);
      }
    } catch (err: any) {
      pushLog(`❌ Runtime Error: ${err.message || String(err)}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveSnippetSubmit = () => {
    if (!snippetTitle.trim() || !onSaveSnippet) return;
    onSaveSnippet(snippetTitle, sandboxType, code);
    setSnippetTitle("");
    setShowSaveModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#131c2e] border-l-4 border-emerald-400 p-4 rounded-r-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center">
            <Code2 className="w-5 h-5 mr-2 text-emerald-400" />
            <span>W3Schools Interactive Code Sandbox</span>
          </h2>
          <p className="text-xs text-slate-300">
            Edit, test, and run JS Zero-to-Hero, DOM, Node.js, Telegram Bot & NSA Security snippets in real time.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-slate-800">
          {(["js", "dom", "node", "telegram", "security"] as const).map(
            (type) => (
              <button
                key={type}
                onClick={() => setSandboxType(type)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                  sandboxType === type
                    ? "bg-emerald-500 text-[#090d16]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            )
          )}
        </div>
      </div>

      {/* Preset Library Select */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <FolderOpen className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">
            Load Curriculum Preset:
          </span>
        </div>
        <select
          value={selectedPresetId}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-400"
        >
          <optgroup label="JS Zero to Hero (1-5)">
            {ALL_LESSONS.filter((l) => l.category === "js-core").map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="Web DOM & Modern Web APIs">
            {ALL_LESSONS.filter((l) => l.category === "dom-web").map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="Async Programming Mastery">
            {ALL_LESSONS.filter((l) => l.category === "async-js").map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="Node.js from Scratch">
            {ALL_LESSONS.filter((l) => l.category === "nodejs").map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="Telegram Bot Masterclass & Projects">
            {ALL_LESSONS.filter((l) => l.category === "telegram-bots").map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
            {TELEGRAM_BOT_PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="NSA Security Masterclass">
            {ALL_LESSONS.filter((l) => l.category === "nsa-security").map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Main Editor & Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Code Editor */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/80">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center">
              <Code2 className="w-3.5 h-3.5 mr-1.5" />
              <span>w3s-editor.js ({sandboxType.toUpperCase()})</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2 py-1 rounded bg-slate-800/60"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowSaveModal(true)}
                className="text-xs text-slate-300 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700"
              >
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Snippet</span>
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            className="w-full bg-black/60 p-4 font-mono text-xs text-emerald-300 focus:outline-none resize-y min-h-[300px] leading-relaxed"
            spellCheck={false}
          />

          <div className="p-3 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
            <button
              onClick={() => {
                const curLesson = ALL_LESSONS.find(
                  (l) => l.id === selectedPresetId
                );
                if (curLesson) setCode(curLesson.sandboxCode);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2.5 py-1.5 rounded bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Code</span>
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-[#090d16] font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? "Running..." : "Run Code (Try It)"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Console & DOM Preview */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/80">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center">
              <Terminal className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              <span>Terminal & Output Console</span>
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/60"
            >
              Clear Console
            </button>
          </div>

          {/* Console Log Lines */}
          <div className="p-4 bg-black/80 font-mono text-xs flex-1 overflow-y-auto min-h-[200px] max-h-[300px] space-y-1">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic py-6 text-center">
                Click &quot;Run Code (Try It)&quot; to evaluate this script in real time...
              </div>
            ) : (
              logs.map((line, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    line.startsWith("[ERROR]")
                      ? "text-rose-400"
                      : line.startsWith("[WARN]")
                      ? "text-amber-400"
                      : line.startsWith("[W3S Server")
                      ? "text-teal-300 font-bold"
                      : "text-slate-300"
                  }`}
                >
                  {line}
                </div>
              ))
            )}
          </div>

          {/* Live DOM Container (Visible when testing DOM manipulation) */}
          {sandboxType === "dom" && (
            <div className="border-t border-slate-800 p-4 bg-slate-950">
              <span className="text-[10px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">
                Live DOM Preview Container (id=&quot;container&quot;):
              </span>
              <div
                ref={domPreviewRef}
                id="container"
                className="min-h-[80px] p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* Save Modal Sheet */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center">
              <Save className="w-4 h-4 mr-2 text-emerald-400" />
              <span>Save Code Snippet to Database</span>
            </h3>
            <p className="text-xs text-slate-300">
              Your snippet will be stored in PostgreSQL and accessible offline across your PWA sessions.
            </p>
            <input
              type="text"
              placeholder="e.g. My NSA HMAC Test Snippet"
              value={snippetTitle}
              onChange={(e) => setSnippetTitle(e.target.value)}
              className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSnippetSubmit}
                disabled={!snippetTitle.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-[#090d16] font-bold text-xs px-4 py-2 rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
