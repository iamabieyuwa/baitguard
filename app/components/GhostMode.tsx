"use client";

import { useAppContext } from "./AppContext";
import { Ghost, ShieldCheck, AlertOctagon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function GhostMode() {
  const { isSimulatorActive, recentThreatLevel } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);

  // Determine state colors based on global app context.
  let glowColor = "border-white/10 shadow-lg glow-white/10";
  let iconColor = "text-white/60";
  let message = "BaitGuard Mini";

  if (isSimulatorActive) {
    glowColor = "border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.4)]";
    iconColor = "text-emerald-400";
    message = "Active Site: Simulation Environment (Safe)";
  } else if (recentThreatLevel === "Threat") {
    glowColor = "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)]";
    iconColor = "text-red-400";
    message = "Threat Neutralized";
  } else if (recentThreatLevel === "Safe") {
    glowColor = "border-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.2)]";
    iconColor = "text-emerald-400";
    message = "Site Verified Safe";
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        className={`glass rounded-full flex items-center gap-3 transition-all cursor-pointer border ${glowColor}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
        initial={{ width: 56, height: 56, borderRadius: 28 }}
        animate={{
          width: isHovered ? "auto" : 56,
          height: 56,
          borderRadius: 28,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="w-14 h-14 flex items-center justify-center shrink-0 relative">
           {/* Pulsing indicator if active or threat */}
           {(isSimulatorActive || recentThreatLevel === "Threat") && !isHovered && (
             <motion.div
               className={`absolute inset-1 rounded-full ${
                 recentThreatLevel === "Threat" ? "bg-red-500/20" : "bg-emerald-400/20"
               }`}
               animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
             />
           )}
           <Ghost className={`w-6 h-6 ${iconColor} transition-colors z-10 relative`} />
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pr-6 whitespace-nowrap overflow-hidden flex items-center gap-2"
            >
              {recentThreatLevel === "Threat" ? (
                <AlertOctagon className="w-4 h-4 text-red-400" />
              ) : isSimulatorActive ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : null}
              <span className={`text-sm font-bold tracking-wide ${iconColor}`}>
                {message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
