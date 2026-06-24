"use client";

import React from "react";
import Link from "next/link";
import { Ticket, ArrowLeft, ShieldQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 max-w-md mx-auto">
      <div className="inline-flex p-4 bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded-3xl shadow-inner animate-bounce">
        <ShieldQuestion className="h-16 w-16" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-(--foreground) tracking-tight">404 - Page Not Found</h1>
        <p className="text-sm text-(--muted)">
          The page you are looking for does not exist, or has been moved to another path.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center space-x-1.5"
        >
          <Ticket className="h-4 w-4 transform -rotate-12" />
          <span>Go to Homepage</span>
        </Link>
        
        <Link
          href="/tickets"
          className="w-full sm:w-auto px-6 py-3 border border-(--card-border) bg-(--card-bg) hover:bg-(--accent) text-(--foreground) font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>View Trips</span>
        </Link>
      </div>
    </div>
  );
}
