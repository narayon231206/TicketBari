"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Clock, Bus, Train, Plane, Ship } from "lucide-react";

export default function TicketCard({ ticket }) {
  const getTransportStyle = (type) => {
    switch (type) {
      case "Bus":
        return { 
          bg: "bg-orange-500", 
          text: "text-orange-600 dark:text-orange-400", 
          lightBg: "bg-orange-50 dark:bg-orange-950", 
          lightText: "text-orange-600 dark:text-orange-300",
          hoverBg: "hover:bg-orange-600",
          icon: <Bus className="h-4 w-4 mr-1" /> 
        };
      case "Train":
        return { 
          bg: "bg-emerald-500", 
          text: "text-emerald-600 dark:text-emerald-400", 
          lightBg: "bg-emerald-50 dark:bg-emerald-950",
          lightText: "text-emerald-600 dark:text-emerald-300",
          hoverBg: "hover:bg-emerald-600",
          icon: <Train className="h-4 w-4 mr-1" /> 
        };
      case "Plane":
        return { 
          bg: "bg-blue-500", 
          text: "text-blue-600 dark:text-blue-400", 
          lightBg: "bg-blue-50 dark:bg-blue-950",
          lightText: "text-blue-600 dark:text-blue-300",
          hoverBg: "hover:bg-blue-600",
          icon: <Plane className="h-4 w-4 mr-1" /> 
        };
      case "Launch":
        return { 
          bg: "bg-cyan-500", 
          text: "text-cyan-600 dark:text-cyan-400", 
          lightBg: "bg-cyan-50 dark:bg-cyan-950",
          lightText: "text-cyan-600 dark:text-cyan-300",
          hoverBg: "hover:bg-cyan-600",
          icon: <Ship className="h-4 w-4 mr-1" /> 
        };
      default:
        return { 
          bg: "bg-violet-600", 
          text: "text-violet-600 dark:text-violet-400", 
          lightBg: "bg-violet-50 dark:bg-violet-950",
          lightText: "text-violet-600 dark:text-violet-300",
          hoverBg: "hover:bg-violet-700",
          icon: null 
        };
    }
  };

  const style = getTransportStyle(ticket.transportType);
  
  return (
    <div className="card-premium flex flex-col h-full overflow-hidden bg-(--card-bg) border border-(--card-border) rounded-2xl shadow-sm">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={ticket.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600"}
          alt={ticket.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
        <span className={`absolute top-3 right-3 px-3 py-1 text-white text-xs font-bold rounded-full shadow-md flex items-center ${style.bg}`}>
          {style.icon}
          {ticket.transportType}
        </span>
      </div>

      <div className="flex flex-col grow p-5">
        <h3 className="text-lg font-bold text-(--foreground) truncate mb-3">{ticket.title}</h3>
        
        <div className="space-y-2 mb-4 grow">
          <div className="flex items-center space-x-2 text-sm text-(--muted)">
            <MapPin className="h-4 w-4 text-violet-500 shrink-0" />
            <span className="truncate">{ticket.from} → {ticket.to}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-(--muted)">
            <Calendar className="h-4 w-4 text-violet-500 shrink-0" />
            <span className="truncate">{new Date(ticket.departureDateTime).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-(--muted)">
            <Clock className="h-4 w-4 text-violet-500 shrink-0" />
            <span className="truncate">{new Date(ticket.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Perks */}
        {ticket.perks && ticket.perks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {ticket.perks.slice(0, 3).map((perk, idx) => (
              <span key={idx} className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${style.lightBg} ${style.lightText}`}>
                {perk}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto border-t border-(--card-border) pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-(--muted)">Price per unit</p>
            <p className={`text-lg font-black ${style.text}`}>৳{ticket.price}</p>
          </div>
          <div>
            <p className="text-xs text-(--muted) text-right">Available</p>
            <p className="text-sm font-bold text-(--foreground) text-right">{ticket.quantity} Left</p>
          </div>
        </div>

        <Link
          href={`/tickets/${ticket._id}`}
          className={`mt-4 w-full py-2.5 px-4 text-center text-sm font-semibold text-white rounded-xl shadow-sm transition-all duration-300 transform active:scale-95 ${style.bg} ${style.hoverBg}`}
        >
          See Details
        </Link>
      </div>
    </div>
  );
}
