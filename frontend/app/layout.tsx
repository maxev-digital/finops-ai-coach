import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/ui/Nav";

export const metadata: Metadata = {
  title: "FinCoach AI — Financial Wellness Coach",
  description:
    "RAG-powered AI financial wellness coaching with fiduciary guardrails, " +
    "personalized to your goals and employer benefits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-slate-200 mt-24 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">
              FinCoach AI provides general financial wellness education only —
              not personalized financial, tax, or investment advice. Consult a
              licensed financial advisor for decisions specific to your
              situation.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
