"use client";
import Link from "next/link";
import { Clapperboard, LogOut } from "lucide-react";
import { checkAuth, logout } from "@/lib/api";
import useSWR from "swr";

export default function Navbar() {
  const { data: user } = useSWR("/api/v1/auth/me", checkAuth);

  return (
    <nav className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Clapperboard className="w-6 h-6 text-emerald-500" />
        <span className="text-xl font-bold tracking-tight">
          Book<span className="text-zinc-500">MyTicket</span>
        </span>
      </Link>
      <div className="flex gap-6 items-center">
        {user ? (
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-zinc-300 hidden sm:inline">
              Welcome, {user.firstName}
            </span>
            <button
              onClick={() => logout()}
              className="group flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 group-hover:text-emerald-500 transition-colors" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex gap-6 items-center">
            <Link
              href="/signin"
              className="text-sm font-bold hover:text-emerald-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 bg-zinc-100 text-black text-sm font-bold rounded-full hover:bg-white transition-all"
            >
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
