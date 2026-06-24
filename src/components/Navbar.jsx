"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, User as UserIcon, Ticket } from "lucide-react";

export default function Navbar() {
  const { user, theme, hydrated, toggleTheme, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "All Tickets", path: "/tickets" },
    ...(user ? [{ name: "Dashboard", path: "/dashboard" }] : []),
  ];

  const isActive = (path) => pathname === path;
  const resolvedTheme = hydrated ? theme : "light";

  return (
    <nav className="sticky top-0 z-50 bg-(--card-bg) border-b border-(--card-border) shadow-sm backdrop-blur-md bg-opacity-95 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-black text-violet-600 dark:text-violet-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white p-1 shadow-sm dark:border-violet-800 dark:bg-slate-900">
                <Image src="/logo.svg" alt="TicketBari logo" width={36} height={36} className="h-8 w-8 rounded-full object-cover" />
              </div>
              <span>TicketBari</span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                  isActive(item.path)
                    ? "text-violet-600 border-b-2 border-violet-600 py-1"
                    : "text-(--foreground) opacity-80"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-(--accent) text-(--foreground) transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-violet-700" />}
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Image
                    src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border-2 border-violet-600 object-cover"
                  />
                  <span className="hidden lg:block text-sm font-semibold max-w-30 truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-(--card-bg) border border-(--card-border) rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                    <div className="px-4 py-2 border-b border-(--card-border)">
                      <p className="text-xs text-(--muted)">Signed in as</p>
                      <p className="text-sm font-bold truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100 rounded-full capitalize">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-(--foreground) hover:bg-(--accent) hover:text-violet-600 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-(--accent) text-(--foreground) transition-colors focus:outline-none"
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-violet-700" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-(--foreground) hover:bg-(--accent) focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Open */}
      {isOpen && (
        <div className="md:hidden bg-(--card-bg) border-t border-(--card-border) px-2 pt-2 pb-4 space-y-1 shadow-inner animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-violet-50 text-violet-600 dark:bg-violet-950"
                  : "text-(--foreground) opacity-80 hover:bg-(--accent)"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {user ? (
            <div className="border-t border-(--card-border) mt-2 pt-2">
              <div className="flex items-center px-3 py-2 space-x-3 mb-2">
                <Image
                  src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border border-violet-600"
                />
                <div>
                  <div className="text-sm font-bold">{user.name}</div>
                  <div className="text-xs text-(--muted)">{user.email}</div>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-(--foreground) hover:bg-(--accent)"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 mt-2 pt-2 border-t border-(--card-border) px-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 text-base font-semibold text-violet-600 hover:bg-(--accent) rounded-lg"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 text-base font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
