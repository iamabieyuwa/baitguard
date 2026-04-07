"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight, CheckCircle2, User, X, AlertOctagon } from "lucide-react";
import { useAppContext } from "./AppContext";

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "You receive an email from your 'CEO' asking for an urgent wire transfer. What do you do?",
    options: [
      "Process it immediately to avoid delaying business.",
      "Reply to the email asking for confirmation.",
      "Check the sender's actual email address and call the CEO directly.",
      "Ignore it, it's not my job."
    ]
  },
  {
    id: 2,
    question: "A pop-up warns you that your computer is infected and provides a number to call. Your reaction?",
    options: [
      "Call the number immediately to fix the issue.",
      "Restart the computer and run my installed antivirus.",
      "Click the 'X' on the pop-up to close it, then continue working.",
      "Download a free anti-malware tool from a link I found on a forum."
    ]
  },
  {
    id: 3,
    question: "How do you manage your passwords for work and personal accounts?",
    options: [
      "I use one very strong password for everything.",
      "I save them in a highly secure text file on my desktop.",
      "I use a password manager with unique generated passwords.",
      "I alter a base password slightly (e.g. Password!1, Password!2)."
    ]
  },
  {
    id: 4,
    question: "You find a random USB drive on your desk. What is your next move?",
    options: [
      "Hand it over to the IT security department.",
      "Plug it in but don't click on any files, just see whose it is.",
      "Throw it in the trash.",
      "Format it and use it as free storage."
    ]
  },
  {
    id: 5,
    question: "When connecting to a public Wi-Fi network at a coffee shop, you:",
    options: [
      "Connect and quickly check my bank balance.",
      "Use a VPN before accessing any sensitive accounts.",
      "Avoid clicking anything that says 'HTTPS'.",
      "Only use it for work emails to stay productive."
    ]
  }
];

export default function SecurityQuiz() {
  const { isQuizOpen, setIsQuizOpen } = useAppContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [phase, setPhase] = useState<"quiz" | "evaluating" | "result" | "error">("quiz");
  const [result, setResult] = useState<{ personaTitle: string; personaDescription: string; safetyTip: string } | null>(null);

  const handleSelectOption = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: string[]) => {
    setPhase("evaluating");
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult(data);
      setPhase("result");
    } catch (err) {
      console.error(err);
      setPhase("error");
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setPhase("quiz");
  };

  const closeModal = () => {
    setIsQuizOpen(false);
    setTimeout(resetQuiz, 300);
  };

  if (!isQuizOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl glass rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.1)] flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white tracking-wide">Security Persona Profiler</h3>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {phase === "quiz" && (
              <motion.div
                key={`q-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">
                  <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span>{Math.round(((currentQuestion) / QUIZ_QUESTIONS.length) * 100)}% Completed</span>
                </div>
                
                <h2 className="text-2xl font-bold text-white leading-snug">
                  {QUIZ_QUESTIONS[currentQuestion].question}
                </h2>

                <div className="space-y-3 pt-4">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-400/10 transition-all group flex items-center justify-between"
                    >
                      <span className="text-slate-200 group-hover:text-white transition-colors">{opt}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === "evaluating" && (
              <motion.div
                key="evaluating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center space-y-6 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <User className="w-16 h-16 text-cyan-400 opacity-80" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Analyzing Profile...</h3>
                  <p className="text-slate-400 text-sm">Processing psychological indicators against threat models.</p>
                </div>
              </motion.div>
            )}

            {phase === "result" && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-400/20 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                  </div>
                  <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs">Your Vulnerability Profile</p>
                  <h2 className="text-3xl font-bold text-white">{result.personaTitle}</h2>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Behavior Analysis</h4>
                    <p className="text-slate-300 leading-relaxed">{result.personaDescription}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Safety Tip
                    </h4>
                    <p className="text-emerald-100/80 leading-relaxed font-medium">{result.safetyTip}</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-bold tracking-wide hover:bg-cyan-300 transition-colors"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </motion.div>
            )}

            {phase === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-4"
              >
                <AlertOctagon className="w-12 h-12 text-red-400 mb-2" />
                <h3 className="text-xl font-bold text-white">Analysis Failed</h3>
                <p className="text-slate-400 text-sm max-w-sm">We couldn't generate your profile. Please check your connection or API key and try again.</p>
                <button
                  onClick={resetQuiz}
                  className="mt-6 px-6 py-2.5 rounded-lg border border-white/20 hover:bg-white/5 text-white font-medium transition-colors"
                >
                  Restart Quiz
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
