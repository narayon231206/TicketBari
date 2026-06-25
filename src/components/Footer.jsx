"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, CreditCard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-(--card-bg) border-t border-(--card-border) text-(--foreground) mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-black text-violet-600 dark:text-violet-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white p-1 shadow-sm dark:border-violet-800 dark:bg-slate-900">
                <Image src="/logo.svg" alt="TicketBari logo" width={36} height={36} className="h-8 w-8 rounded-full object-cover" />
              </div>
              <span>TicketBari</span>
            </Link>
            <p className="text-sm text-(--muted) leading-relaxed">
              Book bus, train, launch & flight tickets easily from anywhere, anytime. Your reliable travel booking partner.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/narayon.chandra.barman.268107" target="_blank" rel="noopener noreferrer" className="text-(--muted) hover:text-violet-600 transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="https://github.com/narayon231206" target="_blank" rel="noopener noreferrer" className="text-(--muted) hover:text-violet-600 transition-colors" aria-label="GitHub">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.38-3.88-1.38-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/narayon-chandra-barman-b9492a390/" target="_blank" rel="noopener noreferrer" className="text-(--muted) hover:text-violet-600 transition-colors" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.75h2.88V18H5.5zM10.38 9.75h2.76v1.12h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.45 1.91 3.45 4.4V18h-2.88v-7.14c0-1.7-.03-3.89-2.37-3.89-2.38 0-2.74 1.86-2.74 3.77V18H10.38z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-violet-600 dark:text-violet-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-(--muted) hover:text-violet-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="text-(--muted) hover:text-violet-600 transition-colors">
                  All Tickets
                </Link>
              </li>
              <li>
                <a href="#" className="text-(--muted) hover:text-violet-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-(--muted) hover:text-violet-600 transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-violet-600 dark:text-violet-400">Contact Info</h3>
            <ul className="space-y-3 text-sm text-(--muted)">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                <a href="mailto:narayon231206@gmail.com" className="hover:text-violet-600 transition-colors break-all">narayon231206@gmail.com</a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                <span>+880 1787946047</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
                <a href="https://www.facebook.com/narayon.chandra.barman.268107" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors break-all">https://www.facebook.com/narayon.chandra.barman.268107</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-violet-600 dark:text-violet-400">Payment Methods</h3>
            <p className="text-sm text-(--muted) mb-3">We accept secure payments via Stripe and cards.</p>
            <div className="flex items-center space-x-2 bg-(--accent) border border-(--card-border) p-3 rounded-lg w-max shadow-sm">
              <CreditCard className="h-6 w-6 text-violet-600 mr-2" />
              <div className="flex space-x-1 font-bold text-xs">
                <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded">Stripe</span>
                <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded">VISA</span>
                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded">MC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-(--card-border) text-center text-xs text-(--muted) flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p>Â© 2026 TicketBari. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-violet-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
