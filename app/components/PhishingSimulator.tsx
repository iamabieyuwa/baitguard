"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Mail,
  ExternalLink,
  Trophy,
  X,
  Share2,
  ShieldCheck,
  AlertTriangle,
  User,
  Link2,
  Clock,
} from "lucide-react";
import { useAppContext } from "./AppContext";

/* ═══════════════════════════════════════════════════════════
   Red-flag definitions
   ═══════════════════════════════════════════════════════════ */
interface RedFlag {
  id: string;
  label: string;
  reason: string;
  icon: React.ElementType;
}

const RED_FLAGS: RedFlag[] = [
  {
    id: "sender",
    label: "Suspicious Sender",
    reason:
      "Legitimate companies use their official domain (e.g. @paypal.com), not a long, hyphenated knock-off like @pay-pal-security-update.com.",
    icon: Mail,
  },
  {
    id: "greeting",
    label: "Generic Greeting",
    reason:
      "Real companies use your name. \"Dear Customer\" is a mass-blast tactic because the attacker doesn't know who you are.",
    icon: User,
  },
  {
    id: "link",
    label: "Malicious Link",
    reason:
      "The button says \"Verify Now\" but the actual URL is a suspicious bit.ly short link designed to hide the real destination.",
    icon: Link2,
  },
  {
    id: "urgency",
    label: "Urgency / Fear Tactic",
    reason:
      "\"Act within 2 hours or your funds are lost\" is a classic pressure tactic to make you act before you think.",
    icon: Clock,
  },
];

const TOTAL_FLAGS = RED_FLAGS.length;
const POINTS_PER_FLAG = 10;
const PENALTY = 5;

/* ═══════════════════════════════════════════════════════════
   Shake animation (wrong click)
   ═══════════════════════════════════════════════════════════ */
const shakeVariants = {
  shake: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.45 },
  },
};

/* ═══════════════════════════════════════════════════════════
   Toast component
   ═══════════════════════════════════════════════════════════ */
function Toast({
  flag,
  onClose,
}: {
  flag: RedFlag;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[90vw] max-w-md glass rounded-xl p-4 border border-emerald-400/30 shadow-lg shadow-emerald-400/10"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-400/10">
          <flag.icon className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-emerald-400">{flag.label}</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {flag.reason}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Penalty toast (wrong click)
   ═══════════════════════════════════════════════════════════ */
function PenaltyToast({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[90vw] max-w-sm glass rounded-xl p-4 border border-red-500/30 shadow-lg shadow-red-500/10"
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
        <p className="text-sm text-red-300">
          That&apos;s not a red flag — <span className="font-bold">−5 pts</span>
        </p>
        <button
          onClick={onClose}
          className="ml-auto text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Mission Accomplished modal
   ═══════════════════════════════════════════════════════════ */
function CompletionModal({
  score,
  onClose,
}: {
  score: number;
  onClose: () => void;
}) {
  const [isSharing, setIsSharing] = useState(false);
  const shareText = `🛡️ I scored ${score} pts on BaitGuard's Phishing Simulator and found all 4 red flags! Can you beat my score? #BaitGuard #CyberSecurity`;

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({ title: "BaitGuard Score", text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Result copied to clipboard!");
      }
    } catch (error: any) {
      // Fallback to clipboard if share fails (e.g., InvalidStateError or AbortError)
      if (error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareText);
          alert("Result copied to clipboard!");
        } catch (clipboardError) {
          console.error("Clipboard fallback failed:", clipboardError);
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="glass rounded-2xl p-8 max-w-sm w-full text-center border border-emerald-400/20 shadow-2xl shadow-emerald-400/10"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center mb-5">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">
          Mission Accomplished
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          You identified all <span className="text-emerald-400 font-bold">4</span>{" "}
          red flags and scored{" "}
          <span className="text-emerald-400 font-bold">{score} pts</span>.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-sm hover:bg-cyan-300 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Share Result
          </button>
          <button
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Fake email template
   ═══════════════════════════════════════════════════════════ */
function PhishingEmail({
  foundFlags,
  onFlagClick,
  onSafeClick,
}: {
  foundFlags: Set<string>;
  onFlagClick: (flag: RedFlag) => void;
  onSafeClick: () => void;
}) {
  const flagRing = (id: string) =>
    foundFlags.has(id)
      ? "ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] bg-emerald-400/5"
      : "hover:ring-1 hover:ring-cyan-400/30 cursor-pointer";

  const getFlag = (id: string) => RED_FLAGS.find((f) => f.id === id)!;

  return (
    <motion.div
      className="glass rounded-2xl overflow-hidden max-w-lg mx-auto"
      variants={shakeVariants}
    >
      {/* ── Email chrome ── */}
      <div className="bg-slate-800/60 px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Mail className="w-3.5 h-3.5" />
          <span>Inbox</span>
          <span className="ml-auto bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
            URGENT
          </span>
        </div>
      </div>

      {/* ── Meta row ── */}
      <div className="px-5 py-4 border-b border-white/5 space-y-2">
        {/* Sender — RED FLAG */}
        <div
          onClick={() => onFlagClick(getFlag("sender"))}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${flagRing("sender")}`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-400">
            PP
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              PayPal Security Team
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              support@pay-pal-security-update.com
            </p>
          </div>
        </div>

        {/* Subject */}
        <p
          onClick={onSafeClick}
          className="text-base font-bold text-white pl-1 cursor-pointer"
        >
          🔒 Urgent: Your account is locked!
        </p>
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-5 space-y-4 text-sm text-slate-300 leading-relaxed">
        {/* Greeting — RED FLAG */}
        <p
          onClick={() => onFlagClick(getFlag("greeting"))}
          className={`inline-block px-2 py-1 rounded-lg transition-all ${flagRing("greeting")}`}
        >
          Dear Customer,
        </p>

        {/* Safe text */}
        <p onClick={onSafeClick} className="cursor-pointer">
          We have detected unusual activity on your PayPal account. For your
          protection, we have temporarily limited your account access.
        </p>

        <p onClick={onSafeClick} className="cursor-pointer">
          To restore full access you need to confirm your identity by verifying
          your account information through our secure portal.
        </p>

        {/* Urgency — RED FLAG */}
        <div
          onClick={() => onFlagClick(getFlag("urgency"))}
          className={`px-3 py-2 rounded-lg bg-amber-400/5 border border-amber-400/10 text-amber-300 text-sm transition-all ${flagRing("urgency")}`}
        >
          ⚠️ You must act within <span className="font-bold">2 hours</span> or
          your funds will be permanently lost.
        </div>

        {/* CTA Button — RED FLAG (link) */}
        <div className="pt-2">
          <div
            onClick={() => onFlagClick(getFlag("link"))}
            className={`group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold transition-all ${flagRing("link")}`}
          >
            <ExternalLink className="w-4 h-4" />
            Verify Now
            {/* Tooltip showing real URL */}
            <span className="pointer-events-none absolute -bottom-8 left-0 text-[10px] text-red-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900/90 px-2 py-1 rounded">
              http://bit.ly/steal-your-data
            </span>
          </div>
        </div>

        {/* Safe footer */}
        <p
          onClick={onSafeClick}
          className="text-xs text-slate-500 pt-4 cursor-pointer"
        >
          If you did not request this, please disregard this email.
          <br />— PayPal Trust & Safety
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main PhishingSimulator
   ═══════════════════════════════════════════════════════════ */
export default function PhishingSimulator() {
  const { setIsSimulatorActive } = useAppContext();
  const [score, setScore] = useState(0);
  const [foundFlags, setFoundFlags] = useState<Set<string>>(new Set());
  const [activeToast, setActiveToast] = useState<RedFlag | null>(null);
  const [showPenalty, setShowPenalty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  /* Correct click */
  const handleFlagClick = useCallback(
    (flag: RedFlag) => {
      if (foundFlags.has(flag.id)) return;

      const next = new Set(foundFlags);
      next.add(flag.id);
      setFoundFlags(next);
      setScore((s) => s + POINTS_PER_FLAG);

      // Show toast
      setShowPenalty(false);
      setActiveToast(flag);
      setTimeout(() => setActiveToast(null), 4000);

      // Completion
      if (next.size === TOTAL_FLAGS) {
        setTimeout(() => setShowModal(true), 600);
      }
    },
    [foundFlags]
  );

  /* Wrong click */
  const handleSafeClick = useCallback(() => {
    setScore((s) => Math.max(0, s - PENALTY));
    setShakeKey((k) => k + 1);
    setActiveToast(null);
    setShowPenalty(true);
    setTimeout(() => setShowPenalty(false), 2500);
  }, []);

  const progress = (foundFlags.size / TOTAL_FLAGS) * 100;
  
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-40% 0px -40% 0px", amount: 0.2 });

  useEffect(() => {
    setIsSimulatorActive(isInView);
  }, [isInView, setIsSimulatorActive]);

  return (
    <section 
      id="simulator" 
      ref={sectionRef}
      className="max-w-4xl mx-auto w-full px-6 py-24"
    >
      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-2">
          Phishing Simulator
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Test Your Instincts
        </h2>
        <p className="mt-3 text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
          This email has{" "}
          <span className="text-cyan-400 font-semibold">4 red flags</span>{" "}
          hiding in plain sight. Click on anything suspicious to expose it.
          Click safe content and you&apos;ll lose points!
        </p>
      </motion.div>

      {/* ── Score + progress bar ── */}
      <div className="max-w-lg mx-auto mb-10 space-y-4">
        <div className="flex items-center justify-center gap-6">
          <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-white font-bold text-lg">{score}</span>
            <span className="text-slate-400 text-sm">pts</span>
          </div>
          <div className="glass rounded-xl px-5 py-3 text-sm text-slate-400">
            <span className="text-emerald-400 font-bold">{foundFlags.size}</span>{" "}
            / {TOTAL_FLAGS} flags
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", damping: 15 }}
          />
        </div>
      </div>

      {/* ── Discovered flags ── */}
      <AnimatePresence>
        {foundFlags.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 space-y-2 max-w-lg mx-auto"
          >
            {RED_FLAGS.filter((f) => foundFlags.has(f.id)).map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-lg px-4 py-2.5 text-sm flex items-start gap-2"
              >
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>
                  <span className="text-emerald-400 font-semibold">
                    {f.label}:
                  </span>{" "}
                  <span className="text-slate-400">{f.reason}</span>
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phishing email ── */}
      <motion.div key={shakeKey} animate="shake" variants={shakeKey > 0 ? shakeVariants : {}}>
        <PhishingEmail
          foundFlags={foundFlags}
          onFlagClick={handleFlagClick}
          onSafeClick={handleSafeClick}
        />
      </motion.div>

      {/* ── Toasts ── */}
      <AnimatePresence>
        {activeToast && (
          <Toast
            key={activeToast.id}
            flag={activeToast}
            onClose={() => setActiveToast(null)}
          />
        )}
        {showPenalty && (
          <PenaltyToast
            key="penalty"
            onClose={() => setShowPenalty(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Completion modal ── */}
      <AnimatePresence>
        {showModal && (
          <CompletionModal
            score={score}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
