"use client";

import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { useAppContext } from "./AppContext";

export default function Hero() {
  const headline = "Don't Take The Bait.";
  const { setIsQuizOpen } = useAppContext();

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 text-center overflow-hidden">
      {/* Glow ring behind headline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

      {/* Animated headline */}
      <motion.h1
        className="relative text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white px-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
      >
        {headline.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", damping: 12 }}
            className={
              char === "."
                ? "text-cyan-400"
                : ""
            }
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative mt-6 max-w-2xl px-4 text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed"
      >
        AI-powered threat detection and phishing simulation to build your{" "}
        <span className="text-cyan-400 font-semibold">human firewall</span>.
      </motion.p>
      
      {/* Quiz Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative mt-8 sm:mt-10 w-full px-4 sm:w-auto flex justify-center"
      >
         <button
            onClick={() => setIsQuizOpen(true)}
            className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-cyan-400 text-slate-950 font-bold text-base sm:text-lg tracking-wide hover:bg-cyan-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
          >
            <Sparkles className="w-5 h-5" />
            Test Your Vulnerability
          </button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
