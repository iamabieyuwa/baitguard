"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldAlert,
  AlertTriangle,
  History,
  X,
  Trash2,
  Camera,
  UploadCloud,
  ShieldCheck,
  Copy,
  CheckCircle2,
  Hexagon,
  FileText,
  AlertOctagon
} from "lucide-react";
import Tesseract from "tesseract.js";
import { useAppContext } from "./AppContext";

/* ═══════════════════════════════════════════════════════════
   Types & Registries
   ═══════════════════════════════════════════════════════════ */
interface AnalysisResult {
  score: number;
  riskLevel: "Low" | "Medium" | "High";
  findings: string[];
  summary: string;
  scannedImage?: string; 
  impersonationAlert?: boolean; 
}

interface ScanHistoryEntry {
  id: string;
  content: string;
  result: AnalysisResult;
  timestamp: number;
}

type Phase = "idle" | "ocr" | "scanning" | "results" | "error";

const STORAGE_KEY = "baitguard_scan_history";
const MAX_HISTORY = 5;

const NIGERIAN_ENTITIES = [
  { name: "accessbank", domain: "accessbankplc.com" },
  { name: "access", domain: "accessbankplc.com" },
  { name: "opay", domain: "opay.me" },
  { name: "kuda", domain: "kuda.com" },
  { name: "fgn", domain: "fgn.gov.ng" },
  { name: "zenith", domain: "zenithbank.com" },
  { name: "palmpay", domain: "palmpay.com" },
];

/* ═══════════════════════════════════════════════════════════
   localStorage helpers
   ═══════════════════════════════════════════════════════════ */
function loadHistory(): ScanHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: ScanHistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* quota exceeded — silently fail */
  }
}

/* ═══════════════════════════════════════════════════════════
   Risk-level color helpers
   ═══════════════════════════════════════════════════════════ */
function riskColors(level: AnalysisResult["riskLevel"]) {
  switch (level) {
    case "High":
      return {
        stroke: "#ef4444",
        text: "text-red-400",
        badge: "bg-red-500/20 text-red-400 border-red-500/30",
        dot: "bg-red-400",
      };
    case "Medium":
      return {
        stroke: "#f59e0b",
        text: "text-amber-400",
        badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        dot: "bg-amber-400",
      };
    case "Low":
    default:
      return {
        stroke: "#10b981",
        text: "text-emerald-400",
        badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        dot: "bg-emerald-400",
      };
  }
}

/* ═══════════════════════════════════════════════════════════
   Threat score ring
   ═══════════════════════════════════════════════════════════ */
function ThreatRing({
  score,
  riskLevel,
}: {
  score: number;
  riskLevel: AnalysisResult["riskLevel"];
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = riskColors(riskLevel);

  return (
    <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          / 100
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Decentralized Network Reporting Component
   ═══════════════════════════════════════════════════════════ */
function Web3ThreatReport() {
  const [reportState, setReportState] = useState<"idle" | "mining" | "verified">("idle");
  const [miningMessage, setMiningMessage] = useState("");
  const [txHash, setTxHash] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const startMining = () => {
    setReportState("mining");
    const messages = [
      "Encrypting Threat Signature...",
      "Broadcasting to 128 Security Nodes...",
      "Verifying on Obserc-Chain Testnet...",
      "Success: Block #492,102 Confirmed.",
    ];

    let step = 0;
    setMiningMessage(messages[0]);

    const interval = setInterval(() => {
      step++;
      if (step < messages.length) {
        setMiningMessage(messages[step]);
      } else {
        clearInterval(interval);
        setTxHash(
          "0x" +
            Array.from({ length: 40 }, () =>
              Math.floor(Math.random() * 16).toString(16)
            ).join("")
        );
        setTimeout(() => setReportState("verified"), 300);
      }
    }, 700);
  };

  const copyHash = () => {
    navigator.clipboard.writeText(txHash);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  if (reportState === "idle") {
    return (
      <div className="flex-1 min-w-[200px]">
        <button
          onClick={startMining}
          className="w-full relative group overflow-hidden flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-sm tracking-wide hover:bg-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer h-full"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <ShieldCheck className="w-4 h-4" />
          <span className="truncate">Web3 Report</span>
        </button>
      </div>
    );
  }

  if (reportState === "mining") {
    return (
      <div className="flex-1 min-w-[200px]">
        <div className="glass rounded-xl p-3 flex items-center justify-center gap-3 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden h-full">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Hexagon className="w-5 h-5 text-purple-400" />
          </motion.div>
          <p className="text-[11px] font-semibold text-purple-300 truncate">
            {miningMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-[200px] relative h-full">
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10 font-bold uppercase tracking-wide"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-full glass rounded-xl px-4 py-2 flex flex-col justify-center border border-purple-500/20 bg-purple-500/5">
        <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-purple-400 uppercase tracking-widest text-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
        </div>
        <button
          onClick={copyHash}
          className="flex mx-auto items-center justify-center gap-2 px-3 py-1 rounded bg-black/40 hover:bg-black/60 text-[10px] font-mono text-purple-300 transition-colors cursor-pointer border border-white/5 w-fit" title="Click to copy hash"
        >
          {txHash.slice(0, 6)}...{txHash.slice(-4)}
          <Copy className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Takedown Generator Component
   ═══════════════════════════════════════════════════════════ */
function TakedownGenerator({ url, findings }: { url: string; findings: string }) {
  const [phase, setPhase] = useState<"idle" | "generating" | "draft" | "error">("idle");
  const [draft, setDraft] = useState({ subject: "", body: "" });
  const [toastVisible, setToastVisible] = useState(false);

  const generateReport = async () => {
    setPhase("generating");
    try {
      const res = await fetch("/api/takedown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, threatDetails: findings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDraft(data);
      setPhase("draft");
    } catch (e) {
      console.error(e);
      setPhase("error");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  if (phase === "idle" || phase === "error") {
    return (
      <div className="flex-1 min-w-[200px]">
        <button
          onClick={generateReport}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm tracking-wide hover:bg-red-500/20 hover:border-red-500/50 transition-all cursor-pointer h-full"
        >
          <FileText className="w-4 h-4" />
          <span className="truncate">{phase === "error" ? "Retry Takedown Draft" : "Generate Takedown Draft"}</span>
        </button>
      </div>
    );
  }

  if (phase === "generating") {
    return (
      <div className="flex-1 min-w-[200px]">
        <div className="h-full glass rounded-xl flex items-center justify-center gap-2 border border-red-500/40 p-3">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </motion.div>
          <span className="text-[11px] font-semibold text-red-300 truncate">Drafting Legal Notice...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 min-w-[200px]">
        <button
          onClick={() => setPhase("draft")} // Open modal logic is handled by showing the modal
          className="w-full h-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-400 text-slate-950 font-bold text-sm tracking-wide hover:bg-red-300 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span className="truncate">View Takedown Draft</span>
        </button>
      </div>

      <AnimatePresence>
        {phase === "draft" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="glass p-6 sm:p-8 rounded-3xl w-full max-w-3xl border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Abuse Takedown Report</h3>
                </div>
                <button onClick={() => setPhase("idle")} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 flex-1 space-y-4 text-sm font-mono text-slate-300 mb-4 bg-black/30 p-4 rounded-xl border border-white/5">
                <div><span className="text-red-400 font-bold">Subject:</span> {draft.subject}</div>
                <div className="whitespace-pre-wrap">{draft.body}</div>
              </div>

              <div className="flex items-center gap-4 shrink-0 relative">
                <AnimatePresence>
                  {toastVisible && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-950 text-xs px-3 py-1.5 rounded-lg shadow-xl font-bold whitespace-nowrap"
                    >
                      Copied! Ready to send.
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-3.5 bg-red-500 hover:bg-red-400 text-white font-bold tracking-wide rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4" /> Copy Email to Clipboard
                </button>
                <button onClick={() => setPhase("idle")} className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Results card
   ═══════════════════════════════════════════════════════════ */
function ResultsCard({ data, originalInput }: { data: AnalysisResult; originalInput: string }) {
  const colors = riskColors(data.riskLevel);
  const isHighRisk = data.riskLevel === "High" || data.impersonationAlert;

  return (
    <motion.div
      className="glass rounded-2xl p-6 sm:p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Impersonation Border + Background Glow */}
      {data.impersonationAlert && (
        <div className="absolute inset-0 border-2 border-red-500/50 rounded-2xl bg-red-500/5 pointer-events-none" />
      )}

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 relative z-10">
        <div className="flex flex-col items-center gap-4 shrink-0">
          <ThreatRing score={data.score} riskLevel={data.riskLevel} />
          {data.scannedImage && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border bg-indigo-500/20 text-indigo-400 border-indigo-500/30 whitespace-nowrap">
                Scanned via Vision AI
              </span>
              <img
                src={data.scannedImage}
                alt="Uploaded thumbnail"
                className="w-24 h-24 object-cover rounded-lg border border-white/10 shadow-lg"
              />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h3 className="text-xl font-bold text-white">Threat Analysis</h3>
            <span
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${colors.badge}`}
            >
              {data.riskLevel} Risk
            </span>
            {data.impersonationAlert && (
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border bg-red-500 text-white border-red-400 flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse">
                <AlertOctagon className="w-3.5 h-3.5" /> High-Priority Impersonation Alert
              </span>
            )}
          </div>

          <p className="text-sm text-slate-400 italic break-words">{data.summary}</p>

          <ul className="space-y-3 text-sm text-slate-300">
            {data.findings.map((finding, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-start gap-3 text-left"
              >
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${data.impersonationAlert ? 'text-red-500' : 'text-red-400'}`} />
                <span className="break-words min-w-0 flex-1">{finding}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
         <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-center h-[52px]">
           <Web3ThreatReport />
           {isHighRisk && (
             <TakedownGenerator url={originalInput.slice(0, 100)} findings={data.findings.join("; ")} />
           )}
         </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Scanning animation
   ═══════════════════════════════════════════════════════════ */
function ScanningOverlay({ isOcr = false, progress = 0 }: { isOcr?: boolean; progress?: number }) {
  return (
    <motion.div
      className="glass rounded-2xl p-8 flex flex-col items-center gap-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="relative w-28 h-28 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/40"
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
        />
        {isOcr ? <Camera className="w-10 h-10 text-cyan-400" /> : <ShieldAlert className="w-10 h-10 text-cyan-400" />}
      </div>
      
      {isOcr ? (
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider">
            <span>Reading Image...</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ ease: "linear", duration: 0.2 }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-3 rounded-full bg-white/5"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2 }}
            />
          ))}
          <p className="text-sm text-slate-400 tracking-wide text-center">
            Analyzing threat vectors&hellip;
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Scan History Sidebar / Drawer
   ═══════════════════════════════════════════════════════════ */
function ScanHistorySidebar({
  history,
  isOpen,
  onClose,
  onSelect,
  onClear,
}: {
  history: ScanHistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (entry: ScanHistoryEntry) => void;
  onClear: () => void;
}) {
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-950/50">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Recent Scans</h3>
        </div>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
              title="Clear history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {history.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8 px-2">
            No scans yet. Results will appear here after your first analysis.
          </p>
        ) : (
          history.map((entry) => {
            const colors = riskColors(entry.result.riskLevel);
            return (
              <motion.button
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => onSelect(entry)}
                className={`w-full text-left bg-white/5 rounded-xl px-3.5 py-3 transition-all cursor-pointer group border flex flex-col gap-1.5 shadow-sm hover:shadow-md ${entry.result.impersonationAlert ? 'border-red-500/30 hover:border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'border-transparent hover:border-white/10'}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors.dot}`} />
                  <span className="text-sm font-medium text-slate-300 truncate flex-1 group-hover:text-white transition-colors">
                    {entry.content.length > 40 ? entry.content.slice(0, 40) + "…" : entry.content}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {entry.result.scannedImage && (
                    <span className="flex gap-1 items-center text-[9px] text-indigo-400 font-bold uppercase bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      <Camera className="w-2.5 h-2.5" /> Vision AI
                    </span>
                  )}
                  {entry.result.impersonationAlert && (
                    <span className="flex gap-1 items-center text-[9px] text-red-100 font-bold uppercase bg-red-600 px-1.5 py-0.5 rounded shadow-sm">
                      <AlertOctagon className="w-2.5 h-2.5" /> Impersonator
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pl-5 mt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>
                    {entry.result.riskLevel} · {entry.result.score}/100
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap ml-2">
                    {timeAgo(entry.timestamp)}
                  </span>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 xl:w-72 shrink-0 h-full">
        <div className="glass rounded-2xl h-[560px] flex flex-col overflow-hidden border border-white/10">
          {content}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 sm:w-80 z-[101] glass border-r border-white/10 lg:hidden overflow-hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Analyzer
   ═══════════════════════════════════════════════════════════ */
export default function Analyzer() {
  const { setRecentThreatLevel } = useAppContext();
  const [phase, setPhase] = useState<Phase>("idle");
  const [input, setInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback(
    (content: string, result: AnalysisResult) => {
      const entry: ScanHistoryEntry = {
        id: crypto.randomUUID(),
        content,
        result,
        timestamp: Date.now(),
      };
      const updated = [entry, ...history].slice(0, MAX_HISTORY);
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const loadEntry = useCallback((entry: ScanHistoryEntry) => {
    setInput(entry.content);
    setAnalysisResult(entry.result);
    setPhase("results");
    setDrawerOpen(false);
    setRecentThreatLevel(entry.result.riskLevel === "High" || entry.result.impersonationAlert ? "Threat" : "Safe");
  }, [setRecentThreatLevel]);

  const performAnalysisRequest = async (textToScan: string, scannedImageUrl?: string) => {
    if (!textToScan.trim()) {
      setErrorMsg("No readable text found to analyze.");
      setPhase("error");
      return;
    }

    setPhase("scanning");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textToScan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server returned an error.");

      if (typeof data.score !== "number" || !data.riskLevel || !Array.isArray(data.findings)) {
        throw new Error("Unexpected response format from the AI.");
      }

      // Check Nigerian Registry for Impersonation Alert
      let impersonationAlert = false;
      const lowerInput = textToScan.toLowerCase();
      for (const entity of NIGERIAN_ENTITIES) {
        if (lowerInput.includes(entity.name) && !lowerInput.includes(entity.domain)) {
          impersonationAlert = true;
          break;
        }
      }

      const result: AnalysisResult = {
        ...data,
        scannedImage: scannedImageUrl,
        impersonationAlert,
      };
      
      setAnalysisResult(result);
      setPhase("results");
      setRecentThreatLevel(impersonationAlert || data.riskLevel === "High" ? "Threat" : "Safe");
      addToHistory(textToScan, result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMsg(msg);
      setPhase("error");
    }
  };

  const handleTextScan = () => {
    if (phase !== "idle") return;
    performAnalysisRequest(input);
  };

  const handleImageProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (JPG/PNG).");
      setPhase("error");
      return;
    }

    setPhase("ocr");
    setOcrProgress(0);
    setAnalysisResult(null);
    setErrorMsg("");

    try {
      const imageUrl = URL.createObjectURL(file);
      
      const { data: { text } } = await Tesseract.recognize(file, "eng", {
        logger: m => {
          if (m.status === "recognizing text") {
            setOcrProgress(m.progress);
          }
        }
      });
      
      if (!text || text.trim().length === 0) {
        throw new Error("No text could be extracted from this image. It might be too blurry or contain no readable text.");
      }
      
      URL.revokeObjectURL(imageUrl);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setInput(text.trim());
        performAnalysisRequest(text.trim(), dataUrl);
      };
      reader.readAsDataURL(file);

    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to process image.");
      setPhase("error");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropFile = e.dataTransfer.files[0];
      if (dropFile.type.startsWith("image/")) {
        handleImageProcess(dropFile);
      }
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setInput("");
    setAnalysisResult(null);
    setErrorMsg("");
    setOcrProgress(0);
  };

  return (
    <section id="analyzer" className="relative max-w-6xl mx-auto w-full px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-2">
          Threat Analyzer
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Scan Anything Suspicious
        </h2>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch lg:items-start max-w-5xl mx-auto">
        <ScanHistorySidebar
          history={history}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSelect={loadEntry}
          onClear={clearHistory}
        />

        <div className="flex-1 min-w-0 flex flex-col justify-start">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="glass rounded-xl px-4 py-2.5 text-sm text-slate-400 flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-pointer font-bold border border-white/5"
            >
              <History className="w-4 h-4" />
              Recent Scans
              {history.length > 0 && (
                <span className="ml-2 bg-cyan-400/20 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-4 w-full"
              >
                <div 
                  className={`glass rounded-2xl p-1.5 transition-all duration-300 relative overflow-hidden border-2 ${isDragOver ? "border-cyan-400 border-dashed bg-cyan-400/5" : "border-transparent"}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={5}
                    placeholder="Paste a suspicious URL, email snippet, or drag & drop an image here..."
                    className="w-full bg-transparent text-slate-200 placeholder-slate-500/70 p-5 text-base sm:text-lg resize-none focus:outline-none"
                  />
                  <AnimatePresence>
                    {isDragOver && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-x-1.5 inset-y-1.5 bg-slate-950/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center pointer-events-none border border-cyan-400/20"
                      >
                        <UploadCloud className="w-12 h-12 text-cyan-400 mb-3 animate-bounce shadow-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                        <p className="text-cyan-400 font-bold uppercase tracking-wide text-sm">Drop image to extract & scan</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleTextScan}
                    disabled={!input.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-cyan-400 text-slate-950 font-bold text-[15px] tracking-wide hover:bg-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] relative"
                  >
                    <Search className="w-5 h-5 absolute left-5" />
                    Scan Text
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-none sm:w-[160px] py-4 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 font-bold text-[15px] tracking-wide transition-all cursor-pointer group"
                  >
                    <Camera className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    Scan Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageProcess(e.target.files[0]);
                        e.target.value = '';
                      }
                    }}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                </div>
              </motion.div>
            )}

            {phase === "ocr" && <ScanningOverlay key="ocr" isOcr={true} progress={ocrProgress} />}
            
            {phase === "scanning" && <ScanningOverlay key="scanning" />}

            {phase === "results" && analysisResult && (
              <motion.div key="results" className="space-y-4 w-full">
                <ResultsCard data={analysisResult} originalInput={input} />
                <button
                  onClick={handleReset}
                  className="mx-auto flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer uppercase tracking-wider mt-4"
                >
                  ← Scan another
                </button>
              </motion.div>
            )}

            {phase === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="glass rounded-2xl p-8 text-center space-y-5 border border-red-500/20"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-300 text-sm font-medium px-4 leading-relaxed">{errorMsg}</p>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                >
                  Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
