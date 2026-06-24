"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [theme, setTheme] = useState("light");
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const syncAuth = useCallback(async () => {
    setLoading(true);
    try {
      const sessionRes = await authClient.getSession();

      if (sessionRes?.data?.user) {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const response = await fetch(`${serverUrl}/api/users/custom-jwt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("ticketbari_jwt", data.token);
          setJwt(data.token);
          setUser(data.user);
        } else {
          localStorage.removeItem("ticketbari_jwt");
          setJwt(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem("ticketbari_jwt");
        setJwt(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth sync error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = window.localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const initializeAuth = async () => {
      await syncAuth();
    };

    void initializeAuth();
  }, [syncAuth]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      localStorage.removeItem("ticketbari_jwt");
      setJwt(null);
      setUser(null);
      showToast({ message: "Signed out successfully.", type: "info" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        jwt,
        theme,
        hydrated,
        loading,
        toggleTheme,
        syncAuth,
        logout,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
