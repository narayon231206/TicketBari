"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Calendar, Clock, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import TicketCard from "@/components/TicketCard";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [transportType, setTransportType] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isActive = true;

    const loadTickets = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          from: searchFrom,
          to: searchTo,
          transportType,
          sort: sortOrder,
          page: String(page),
          limit: "8",
        });

        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/api/tickets?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch tickets");

        const data = await res.json();

        if (!isActive) return;
        setTickets(data.tickets || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (!isActive) return;
        console.error("Error fetching tickets:", err);
        setTickets([]);
        setTotalPages(1);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadTickets();

    return () => {
      isActive = false;
    };
  }, [page, searchFrom, searchTo, transportType, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-(--foreground)">Find Your Next Destination</h1>
        <p className="text-sm text-(--muted)">Search and filter tickets across multiple transport systems.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-(--card-bg) border border-(--card-border) p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-violet-500" />
            <input
              type="text"
              placeholder="From (Departure City)"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl text-sm focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-violet-500" />
            <input
              type="text"
              placeholder="To (Destination City)"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl text-sm focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-sm transition-all duration-300"
          >
            <Search className="h-4 w-4" />
            <span>Search Trips</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-(--card-border) flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Transport Type Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-(--muted) mr-2 flex items-center space-x-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>FILTER:</span>
            </span>
            {["All", "Bus", "Train", "Launch", "Plane"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTransportType(type);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${transportType === type
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-(--accent) text-(--foreground) border border-(--card-border) hover:bg-violet-50 dark:hover:bg-violet-950"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sorter */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-(--muted) flex items-center space-x-1 shrink-0">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>SORT PRICE:</span>
            </span>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-3 py-1.5 bg-(--accent) border border-(--card-border) rounded-lg text-xs font-bold focus:outline-none focus:border-violet-600"
            >
              <option value="">Default (Latest)</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-(--card-bg) border border-(--card-border) rounded-2xl p-6 text-(--muted)">
          No approved tickets found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-(--card-border) bg-(--card-bg) rounded-lg text-(--foreground) disabled:opacity-40 hover:bg-(--accent) transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-xs font-bold text-(--foreground)">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border border-(--card-border) bg-(--card-bg) rounded-lg text-(--foreground) disabled:opacity-40 hover:bg-(--accent) transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
