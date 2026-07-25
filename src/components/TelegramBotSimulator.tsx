"use client";

import React, { useState } from "react";
import { TELEGRAM_BOT_PROJECTS } from "@/data/curriculum";
import { ProjectSpec } from "@/data/types";
import {
  Bot,
  Play,
  ShieldCheck,
  FileText,
  Lock,
  Terminal,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface TelegramBotSimulatorProps {
  onOpenInSandbox: (code: string, type: "js" | "dom" | "node" | "telegram" | "security") => void;
}

export const TelegramBotSimulator: React.FC<TelegramBotSimulatorProps> = ({
  onOpenInSandbox,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectSpec>(
    TELEGRAM_BOT_PROJECTS[0]
  );
  const [simRunning, setSimRunning] = useState(false);
  const [simInput, setSimInput] = useState("/files");
  const [simResult, setSimResult] = useState<any | null>(null);
  const [simTab, setSimTab] = useState<"code" | "simulator">("simulator");

  const runProjectSimulation = async () => {
    setSimRunning(true);
    setSimResult(null);

    try {
      let action = "test_group_guard";
      let payload: any = { text: simInput, user: "Alex_Dev" };

      if (selectedProject.id === "tg-proj-2-interactive-buttons") {
        action = "test_inline_query";
        payload = { query: simInput };
      } else if (selectedProject.id === "tg-proj-3-crypto-token-guard") {
        action = "test_crypto_referral";
        payload = { userId: "USER_7788" };
      } else if (selectedProject.id === "tg-proj-4-multi-group-locker") {
        action = "test_multi_group";
        payload = { userId: "USER_999", fileId: "nsa-handbook-2026.pdf", forceMember: true };
      } else if (selectedProject.id === "tg-proj-5-nsa-audit-bot") {
        action = "test_nsa_audit";
        payload = {
          secretHeader: "NSA-SECRET-WEBHOOK-2026",
          nonce: `nonce-${Date.now()}`,
        };
      }

      const response = await fetch("/api/telegram/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const data = await response.json();
      setSimResult(data);
    } catch (err) {
      setSimResult({
        status: "error",
        message: "Simulation failed. Are you offline?",
      });
    } finally {
      setSimRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/30 rounded-2xl p-5 space-y-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Telegram Bot Masterclass & 5 Projects
            </h2>
            <p className="text-xs text-slate-300">
              With & without Telegraf library • Inline Mode • Crypto Tokens • NSA Audit
            </p>
          </div>
        </div>
      </div>

      {/* Project Selection Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {TELEGRAM_BOT_PROJECTS.map((proj, idx) => {
          const isSelected = selectedProject.id === proj.id;
          return (
            <button
              key={proj.id}
              onClick={() => {
                setSelectedProject(proj);
                setSimResult(null);
                if (proj.id === "tg-proj-1-group-guard") setSimInput("/files");
                else if (proj.id === "tg-proj-2-interactive-buttons") setSimInput("nsa");
                else setSimInput("default");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-1.5 ${
                isSelected
                  ? "bg-teal-500 text-[#090d16] border-teal-400 shadow-lg shadow-teal-500/20"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              <span>{idx + 1}.</span>
              <span>{proj.title.split(":")[1] || proj.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Project Card */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Subnavbar: Simulator vs Code */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-white">
              {selectedProject.title}
            </span>
            <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono font-bold">
              {selectedProject.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSimTab("simulator")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                simTab === "simulator"
                  ? "bg-teal-500 text-[#090d16]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Live Simulator
            </button>
            <button
              onClick={() => setSimTab("code")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                simTab === "code"
                  ? "bg-teal-500 text-[#090d16]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Source Code
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Live Simulator */}
        {simTab === "simulator" && (
          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white">
                How this Bot Project works:
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedProject.features.map((feat, i) => (
                <div
                  key={i}
                  className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl flex items-start space-x-2 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Interactive Simulation Input Panel */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center">
                  <Terminal className="w-4 h-4 mr-1.5" />
                  <span>Simulate Bot Update / Request</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Server-side API execution
                </span>
              </div>

              {selectedProject.id === "tg-proj-1-group-guard" && (
                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Enter a Chat Command or Message Text:
                  </label>
                  <input
                    type="text"
                    value={simInput}
                    onChange={(e) => setSimInput(e.target.value)}
                    placeholder="Try /files, or t.me/joinchat spam link..."
                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => setSimInput("/files")}
                      className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700"
                    >
                      /files
                    </button>
                    <button
                      onClick={() =>
                        setSimInput("Check this out! http://spam-crypto-airdrop.me")
                      }
                      className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700"
                    >
                      Test Spam Link
                    </button>
                  </div>
                </div>
              )}

              {selectedProject.id === "tg-proj-2-interactive-buttons" && (
                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Inline Search Query (@mybot &lt;query&gt;):
                  </label>
                  <input
                    type="text"
                    value={simInput}
                    onChange={(e) => setSimInput(e.target.value)}
                    placeholder="Search 'nsa', 'closures', or 'streams'..."
                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
              )}

              {selectedProject.id === "tg-proj-3-crypto-token-guard" && (
                <div className="text-xs text-slate-300">
                  Click below to generate a cryptographically signed HMAC SHA-256 referral code and AES-256-GCM encrypted access token using server-side Node.js crypto.
                </div>
              )}

              {selectedProject.id === "tg-proj-4-multi-group-locker" && (
                <div className="text-xs text-slate-300">
                  Simulates checking user membership across @JSHeroChannel and @W3SchoolsJS before generating an expiring 5-minute download token.
                </div>
              )}

              {selectedProject.id === "tg-proj-5-nsa-audit-bot" && (
                <div className="text-xs text-slate-300">
                  Runs an NSA-level webhook header verification using crypto.timingSafeEqual and tests against duplicate replay nonces.
                </div>
              )}

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={runProjectSimulation}
                  disabled={simRunning}
                  className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 text-[#090d16] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-teal-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {simRunning ? "Executing..." : "Run Server Simulation"}
                  </span>
                </button>

                <button
                  onClick={() =>
                    onOpenInSandbox(
                      selectedProject.code,
                      selectedProject.sandboxType
                    )
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Open in Code Sandbox</span>
                </button>
              </div>
            </div>

            {/* Simulation Results Box */}
            {simResult && (
              <div className="bg-black/60 border border-teal-500/30 rounded-xl p-4 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400">
                    ⚡ Simulation Output (JSON)
                  </span>
                  <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800 font-mono">
                    Status: {simResult.status}
                  </span>
                </div>
                <pre className="text-xs font-mono text-teal-300 whitespace-pre-wrap overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {JSON.stringify(simResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Project Code View */}
        {simTab === "code" && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Complete Project Code Snippet
              </span>
              <button
                onClick={() =>
                  onOpenInSandbox(
                    selectedProject.code,
                    selectedProject.sandboxType
                  )
                }
                className="bg-emerald-500 hover:bg-emerald-400 text-[#090d16] font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Try It Yourself</span>
              </button>
            </div>

            <pre className="font-mono text-xs text-emerald-300 bg-black/70 p-4 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {selectedProject.code}
            </pre>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Architectural Breakdown:
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedProject.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
