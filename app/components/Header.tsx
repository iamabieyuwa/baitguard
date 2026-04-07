"use client";

import { Shield, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const scrollToSimulator = () => {
    document
      .getElementById("simulator")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Shield className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <span className="text-xl font-bold tracking-tight text-white">
            Bait<span className="text-cyan-400">Guard</span>
          </span>
        </a>

        {/* CTA */}
        <button
          onClick={scrollToSimulator}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all cursor-pointer"
        >
          <Crosshair className="w-4 h-4" />
          Launch Simulator
        </button>
      </div>
    </motion.header>
  );
}
