"use client";
import Link from "next/link";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          {/* Branding */}
          <div>
            <h3 className="text-lg font-bold mb-2">
              Book<span className="text-zinc-500">MyTicket</span>
            </h3>
            <p className="text-sm text-zinc-400">
              Experience cinema like never before
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            {/* Email */}
            <a
              href="mailto:jhasaurav0209001@gmail.com"
              className="flex items-center gap-2 text-zinc-400 hover:text-emerald-500 transition-colors"
              aria-label="Email"
            >
              <HiOutlineEnvelope className="w-5 h-5" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-emerald-500 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/srvjha"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-emerald-500 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/J_srv001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-emerald-500 transition-colors"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>&copy; 2026 BookMyTicket. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
