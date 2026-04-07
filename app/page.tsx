import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Analyzer from "@/app/components/Analyzer";
import PhishingSimulator from "@/app/components/PhishingSimulator";
import { Shield } from "lucide-react";
import { AppProvider } from "@/app/components/AppContext";
import GhostMode from "@/app/components/GhostMode";
import SecurityQuiz from "@/app/components/SecurityQuiz";

export default function Home() {
  return (
    <AppProvider>
      <Header />
      <Hero />
      <SecurityQuiz />
      <GhostMode />

      {/* Divider */}
      <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <Analyzer />

      {/* Divider */}
      <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <PhishingSimulator />

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400/40" />
            <span>&copy; {new Date().getFullYear()} BaitGuard. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </AppProvider>
  );
}
