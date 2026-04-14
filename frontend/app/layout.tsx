import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book My Ticket",
  description: "Experience cinema like never before with Book My Ticket.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fafafa",
              border: "1px solid #27272a",
              fontSize: "14px",
              fontWeight: "600",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#18181b",
              },
            },
          }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
