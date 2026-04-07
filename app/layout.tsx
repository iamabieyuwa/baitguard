import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BaitGuard — AI Phishing Detection & Simulation",
  description:
    "AI-powered threat detection and phishing simulation to build your human firewall. Scan suspicious URLs, emails, and SMS in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark antialiased"
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
