"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Key,
  Terminal,
  AlertTriangle,
  Code2,
  CheckCircle2,
  Cpu,
} from "lucide-react";

interface NSASecurityVaultProps {
  onOpenInSandbox: (code: string, type: "js" | "dom" | "node" | "telegram" | "security") => void;
}

export const NSASecurityVault: React.FC<NSASecurityVaultProps> = ({
  onOpenInSandbox,
}) => {
  const [activeTab, setActiveTab] = useState<
    "owasp" | "hmac" | "aes" | "timing-safe"
  >("owasp");

  // HMAC Sandbox State
  const [hmacSecret, setHmacSecret] = useState("NSA-ROOT-SECRET-2026");
  const [hmacPayload, setHmacPayload] = useState("USER_ID:1099283:GRANT_ADMIN");
  const [hmacResult, setHmacResult] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // XSS & SSRF Demo State
  const [urlInput, setUrlInput] = useState("http://169.254.169.254/latest/meta-data/");
  const [ssrfVerdict, setSsrfVerdict] = useState<any | null>(null);

  const checkSsrfGuard = () => {
    try {
      const parsed = new URL(urlInput);
      const isInternal =
        parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1" ||
        parsed.hostname.startsWith("169.254.") ||
        parsed.hostname.startsWith("10.");

      if (isInternal) {
        setSsrfVerdict({
          allowed: false,
          reason: "BLOCKED_RFC1918_PRIVATE_OR_METADATA_IP",
          hostname: parsed.hostname,
        });
      } else {
        setSsrfVerdict({
          allowed: true,
          reason: "PUBLIC_INTERNET_SAFE",
          hostname: parsed.hostname,
        });
      }
    } catch {
      setSsrfVerdict({ allowed: false, reason: "INVALID_URL_SYNTAX" });
    }
  };

  const testServerCrypto = async (actionType: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/telegram/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_crypto_referral",
          payload: { userId: "NSA_AGENT_007", customSecret: hmacSecret },
        }),
      });
      const data = await res.json();
      setHmacResult(data);
    } catch (e) {
      setHmacResult({ error: "Crypto execution failed" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/60 border border-rose-500/30 rounded-2xl p-5 space-y-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              NSA-Grade Web & Bot Security Masterclass
            </h2>
            <p className="text-xs text-slate-300">
              OWASP Top 10 • HMAC-SHA256 • AES-256-GCM AEAD • Timing-Safe Equality • Anti-Replay
            </p>
          </div>
        </div>
      </div>

      {/* Sub-tab selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: "owasp", label: "1. OWASP Top 10 & SSRF", icon: ShieldCheck },
          { id: "hmac", label: "2. HMAC-SHA256 Signatures", icon: Key },
          { id: "aes", label: "3. AES-256-GCM Vault", icon: Lock },
          { id: "timing-safe", label: "4. Timing-Safe & Nonce", icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                isSelected
                  ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20"
                  : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content for Tab 1: OWASP & SSRF */}
      {activeTab === "owasp" && (
        <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">
              Server-Side Request Forgery (SSRF) Protection in Telegram Bots
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              When a Telegram bot fetches an external image or file from a user-provided URL, attackers often pass AWS cloud metadata IPs (<code className="text-rose-400">169.254.169.254</code>) or internal database ports (<code className="text-rose-400">127.0.0.1:5432</code>) to steal cloud credentials!
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Interactive SSRF Firewall Checker
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter URL to audit..."
                className="flex-1 bg-black/50 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400"
              />
              <button
                onClick={checkSsrfGuard}
                className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Audit URL Safety
              </button>
            </div>

            {ssrfVerdict && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-mono ${
                  ssrfVerdict.allowed
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                    : "bg-rose-950/60 border-rose-500/60 text-rose-300"
                }`}
              >
                <strong>Verdict: </strong>
                {ssrfVerdict.allowed
                  ? "✅ ALLOWED (Public Internet Host)"
                  : `❌ BLOCKED (${ssrfVerdict.reason})`}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between bg-black/40 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300 font-medium">
              Want to inspect the complete OWASP Top 10 code?
            </span>
            <button
              onClick={() =>
                onOpenInSandbox(
                  `// Complete XSS & SSRF Guard Example\nfunction isSafeUrl(url) {\n  const p = new URL(url);\n  if (p.hostname.startsWith("169.254.") || p.hostname === "localhost") return false;\n  return true;\n}\nconsole.log("Is AWS Metadata safe?", isSafeUrl("http://169.254.169.254"));`,
                  "security"
                )
              }
              className="bg-emerald-500 hover:bg-emerald-400 text-[#090d16] font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Open in Sandbox</span>
            </button>
          </div>
        </div>
      )}

      {/* Content for Tab 2: HMAC Signatures */}
      {activeTab === "hmac" && (
        <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">
              HMAC-SHA256 Webhook Signature Verification
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              When Telegram sends a webhook request, you must verify the <code className="text-emerald-400">X-Telegram-Bot-Api-Secret-Token</code> header using HMAC-SHA256 so attackers cannot impersonate Telegram!
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Secret Master Key:
                </label>
                <input
                  type="text"
                  value={hmacSecret}
                  onChange={(e) => setHmacSecret(e.target.value)}
                  className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Payload to Sign:
                </label>
                <input
                  type="text"
                  value={hmacPayload}
                  onChange={(e) => setHmacPayload(e.target.value)}
                  className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={() => testServerCrypto("hmac")}
              disabled={isProcessing}
              className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              {isProcessing ? "Signing..." : "Generate Server HMAC Checksum"}
            </button>

            {hmacResult && (
              <div className="bg-black/70 p-3.5 rounded-xl border border-rose-500/30 text-xs font-mono text-rose-300 space-y-1">
                <div>
                  <strong>Referral Code: </strong> {hmacResult.referralCode}
                </div>
                <div>
                  <strong>HMAC SHA-256 Tag: </strong> {hmacResult.hmacChecksum}
                </div>
                <div className="text-emerald-400 font-bold">
                  ✓ {hmacResult.verificationStatus}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content for Tab 3: AES-256-GCM */}
      {activeTab === "aes" && (
        <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">
              AES-256-GCM Authenticated Encryption (AEAD)
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Unlike legacy CBC mode, GCM mode produces an Authentication Tag (<code className="text-emerald-400">authTag</code>) that guarantees ciphertext integrity. If even one bit of the encrypted token is modified by an attacker, decryption fails automatically!
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <button
              onClick={() => testServerCrypto("aes")}
              disabled={isProcessing}
              className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              Generate AES-256-GCM Encrypted Token Vault
            </button>

            {hmacResult && hmacResult.aesGcmToken && (
              <div className="bg-black/70 p-3.5 rounded-xl border border-rose-500/30 text-xs font-mono text-emerald-300 break-all space-y-2">
                <div>
                  <strong className="text-white block mb-1">
                    AES-256-GCM Encrypted Token (IV . Ciphertext . AuthTag):
                  </strong>
                  {hmacResult.aesGcmToken}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content for Tab 4: Timing-Safe & Nonce */}
      {activeTab === "timing-safe" && (
        <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">
              Timing-Safe Equality & Anti-Replay Nonce Verification
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Standard string comparison (<code className="text-rose-400">===</code>) aborts on the first mismatched character, allowing attackers to guess secret tokens using timing analysis. <code className="text-emerald-400">crypto.timingSafeEqual</code> takes constant time.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-xs text-slate-300">
              Click below to test Telegram Bot Project 5 (NSA-Grade Security Audit Bot) which checks timing-safe equality and rejects duplicate replay nonces.
            </div>

            <button
              onClick={() =>
                onOpenInSandbox(
                  `// Testing Timing-Safe Equality in Node.js\nimport crypto from "crypto";\n\nconst realToken = "NSA-SECRET-WEBHOOK-TOKEN";\nconst attemptToken = "NSA-SECRET-WEBHOOK-TOKEN";\n\nconst a = Buffer.from(realToken);\nconst b = Buffer.from(attemptToken);\n\nconst isValid = a.length === b.length && crypto.timingSafeEqual(a, b);\nconsole.log("Timing-safe comparison match:", isValid);`,
                  "security"
                )
              }
              className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              Open NSA Timing-Safe Verification in Sandbox
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
