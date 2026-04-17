import "./globals.css";
import type { Metadata } from "next";
import  Navbar  from "@/components/ui/Navbar"; // Ensure this path matches your Navbar's location

export const metadata: Metadata = {
  title: "UNT Professor Index",
  description: "Centralized faculty and course resource for UNT students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}