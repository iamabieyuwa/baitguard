# BaitGuard 🛡️

BaitGuard is a next-generation AI-powered phishing detection and cybersecurity simulation suite. It uses the `llama-3.3-70b-versatile` model via the Groq API to analyze suspicious content, URLs, and text in real-time, helping users build a "human firewall".

## Features ✨

- **AI Threat Analyzer**: Paste any URL, email, or SMS to get an instant AI risk assessment with detailed heuristic breakdowns.
- **Vision AI (OCR)**: Integrates `tesseract.js` so you can upload or drag-and-drop screenshots of suspicious emails for instant text extraction and AI analysis.
- **Nigerian Entity Impersonation Registry**: Protects against specific local vectors by auto-flagging typosquatted domains representing popular institutions (e.g., Access Bank, OPay, Kuda).
- **Takedown Generator**: Caught a phisher? Automatically generate and copy a structured Legal Abuse/Takedown notice using Groq LLM integration.
- **Security Persona Quiz**: A 5-question interactive evaluation to see your human firewall strength (e.g., "The Vigilant Guardian" vs "The High-Risk Target").
- **Phishing Simulator**: Train yourself to spot red flags in a gamified simulation environment.
- **Ghost Mode UI**: A responsive, contextual overlay UI simulating browser-extension protections.

## Tech Stack 🚀

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI / LLM**: [Groq SDK](https://console.groq.com/)
- **OCR**: [Tesseract.js](https://tesseract.projectnaptha.com/)

## Getting Started 💻

To run the development server locally, you'll need a Groq API Key.

1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment 🌐

This project is fully optimized and ready to ship on [Vercel](https://vercel.com/new).

**Important Deployment Steps:**

1. Connect your GitHub repository to Vercel.
2. Under "Environment Variables", make sure to add `GROQ_API_KEY`.
3. The build command (`npm run build`) is fully configured by Next.js defaults.
4. Deploy!

_(Note: Google Fonts optimization via `next/font/google` is currently bypassed in `layout.tsx` to prevent build timeouts on restricted connections. You can re-enable it if deploying to Vercel/Netlify.)_
