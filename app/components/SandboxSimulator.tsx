"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Lock, Eye, EyeOff } from "lucide-react";

/* ── Red-flag hotspot data ── */
interface Flag {
  id: string;
  label: string;
  hint: string;
  /* Position offsets within the fake card (percentages) */
  area: "url" | "header" | "badge" | "urgency";
}

const RED_FLAGS: Flag[] = [
  {
    id: "url",
    label: "Fake URL",
    hint: "The URL \"chase-bank-verify.com\" is not a real Chase domain.",
    area: "url",
  },
  {
    id: "header",
    label: "Typo in Header",
    hint: "\"Chas\" is misspelled — real brands don't make this mistake.",
    area: "header",
  },
  {
    id: "badge",
    label: "Fake SSL Badge",
    hint: "A self-declared \"Secure\" badge doesn't mean the site is legitimate.",
    area: "badge",
  },
  {
    id: "urgency",
    label: "Urgency Tactic",
    hint: "\"Your account will be suspended\" creates panic to bypass your judgment.",
    area: "urgency",
  },
];

/* ── Points pop-up ── */
function PointsPopup({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -40, scale: 1.3 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="pointer-events-none fixed z-[100] text-emerald-400 font-bold text-lg"
      style={{ left: x, top: y }}
    >
      +10 pts
    </motion.div>
  );
}

/* ── Fake bank login card ── */
function FakeBankCard({
  found,
  onFlag,
}: {
  found: Set<string>;
  onFlag: (flag: Flag, e: React.MouseEvent) => void;
}) {
  const [showPw, setShowPw] = useState(false);

  const ring = (id: string) =>
    found.has(id)
      ? "ring-2 ring-emerald-400 bg-emerald-400/10 rounded-md transition-all"
      : "rounded-md transition-all cursor-pointer hover:ring-1 hover:ring-cyan-400/30";

  const getFlag = (area: string) => RED_FLAGS.find((f) => f.area === area)!;

  return (
    <div className="relative glass rounded-2xl overflow-hidden max-w-md mx-auto">
      {/* Fake browser chrome */}
      <div className="bg-slate-800/80 px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        {/* URL bar — red flag */}
        <div
          onClick={(e) => onFlag(getFlag("url"), e)}
          className={`flex-1 text-xs px-3 py-1.5 bg-slate-900/60 text-slate-400 flex items-center gap-1.5 ${ring("url")}`}
        >
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>
            https://<span className="text-white font-medium">chase-bank-verify.com</span>/login
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-8 space-y-6">
        {/* Bank header — red flag (typo) */}
        <div
          onClick={(e) => onFlag(getFlag("header"), e)}
          className={`text-center px-3 py-2 ${ring("header")}`}
        >
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Chas<span className="text-blue-400">e</span>{" "}
            <span className="text-blue-400">Bank</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Secure Online Banking</p>
        </div>

        {/* Urgency banner — red flag */}
        <div
          onClick={(e) => onFlag(getFlag("urgency"), e)}
          className={`text-center text-sm py-2 px-3 text-amber-300 bg-amber-400/10 border border-amber-400/20 ${ring("urgency")}`}
        >
          ⚠️ Your account will be suspended in 24 hours. Verify now!
        </div>

        {/* Fake form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 pl-1">
              Username or Email
            </label>
            <input
              type="text"
              defaultValue="john.doe@email.com"
              readOnly
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-white/10 text-sm text-slate-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                defaultValue="supersecret123"
                readOnly
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-white/10 text-sm text-slate-300 focus:outline-none pr-10"
              />
              <button
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors cursor-pointer">
            Sign In
          </button>
        </div>

        {/* Fake badge — red flag */}
        <div
          onClick={(e) => onFlag(getFlag("badge"), e)}
          className={`mx-auto flex items-center justify-center gap-1.5 text-[11px] text-emerald-400/60 px-3 py-1.5 ${ring("badge")}`}
        >
          <Lock className="w-3 h-3" />
          256-bit SSL Secure &bull; Verified by SecureTrust™
        </div>
      </div>
    </div>
  );
}

/* ── Main Simulator ── */
export default function SandboxSimulator() {
  const [score, setScore] = useState(0);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [popups, setPopups] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const handleFlag = useCallback(
    (flag: Flag, e: React.MouseEvent) => {
      if (found.has(flag.id)) return;
      setScore((s) => s + 10);
      setFound((prev) => new Set(prev).add(flag.id));
      setPopups((p) => [...p, { id: Date.now(), x: e.clientX, y: e.clientY }]);
    },
    [found]
  );

  const allFound = found.size === RED_FLAGS.length;

  return (
    <section id="simulator" className="max-w-4xl mx-auto w-full px-6 py-24">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-2">
          Sandbox Simulator
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Test Your Instincts
        </h2>
        <p className="mt-3 text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
          This fake bank login page has{" "}
          <span className="text-cyan-400 font-semibold">4 red flags</span>{" "}
          hidden in plain sight. Can you find them all?
        </p>
      </motion.div>

      {/* Score bar */}
      <div className="flex items-center justify-center gap-6 mb-10">
        <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-white font-bold text-lg">{score}</span>
          <span className="text-slate-400 text-sm">pts</span>
        </div>
        <div className="glass rounded-xl px-5 py-3 text-sm text-slate-400">
          <span className="text-emerald-400 font-bold">{found.size}</span> /{" "}
          {RED_FLAGS.length} flags found
        </div>
      </div>

      {/* Hints row */}
      <AnimatePresence>
        {found.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 space-y-2 max-w-md mx-auto"
          >
            {RED_FLAGS.filter((f) => found.has(f.id)).map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-lg px-4 py-2.5 text-sm flex items-start gap-2"
              >
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <span className="text-emerald-400 font-semibold">
                    {f.label}:
                  </span>{" "}
                  <span className="text-slate-400">{f.hint}</span>
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fake card */}
      <FakeBankCard found={found} onFlag={handleFlag} />

      {/* Completion message */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-3">
              <span className="text-2xl">🎉</span>
              <span className="text-emerald-400 font-bold text-sm">
                All flags found! You scored {score} points.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Points pop-ups */}
      <AnimatePresence>
        {popups.map((p) => (
          <PointsPopup key={p.id} x={p.x} y={p.y} />
        ))}
      </AnimatePresence>
    </section>
  );
}
