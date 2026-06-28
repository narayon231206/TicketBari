"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { apiFetch } from "@/lib/api";
import { showToast } from "@/lib/toast";
import Countdown from "@/components/Countdown";
import { useForm, useWatch } from "react-hook-form";
import { MapPin, Calendar, Clock, Sparkles, Loader2, ArrowLeft, Ticket as TicketIcon } from "lucide-react";
import Link from "next/link";

export default function TicketDetails() {
  const { id } = useParams();
  const { user, loading: authLoading } = useApp();
  const router = useRouter();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
  const requestedQuantity = useWatch({ control, name: "quantity", defaultValue: 1 });

  useEffect(() => {
    // Wait until auth state is resolved
    if (authLoading) return;

    // Check if logged in. If not, redirect to login
    if (!user) {
      router.push(`/login?redirect=/tickets/${id}`);
      return;
    }

    const fetchTicket = async () => {
      try {
        const data = await apiFetch(`/api/tickets/${id}`);
        setTicket(data);
      } catch (err) {
        setError(err.message || "Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [authLoading, id, router, user]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        <p className="text-sm text-(--muted)">Loading trip details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <div className="p-4 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-2xl text-sm font-bold">
          {error || "Ticket not found."}
        </div>
        <Link href="/tickets" className="inline-flex items-center space-x-1 text-sm text-violet-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Tickets</span>
        </Link>
      </div>
    );
  }

  const isDeparturePassed = new Date(ticket.departureDateTime) <= new Date();
  const isSoldOut = ticket.quantity <= 0;
  const isBookingDisabled = isDeparturePassed || isSoldOut;

  const handleBookingSubmit = async (formData) => {
    setBookingLoading(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          ticketId: ticket._id,
          quantity: formData.quantity,
        }),
      });

      setModalOpen(false);
      reset();
      showToast({ message: "Booking request submitted successfully.", type: "success" });
      router.push("/"); // Redirects to Home Page
    } catch (err) {
      showToast({ message: err.message || "Failed to book ticket.", type: "error" });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Back button */}
      <Link href="/tickets" className="inline-flex items-center space-x-1 text-sm font-bold text-violet-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Tickets</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-(--card-bg) border border-(--card-border) rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Left column: Image & Perks */}
        <div className="space-y-6">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl shadow-inner border border-(--card-border)">
            <Image
              src={ticket.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"}
              alt={ticket.title}
              fill
              className="object-cover"
            />
            <span className="absolute top-3 right-3 px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-full">
              {ticket.transportType}
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center space-x-1">
              <Sparkles className="h-4 w-4" />
              <span>Available Perks & Amenities</span>
            </h3>
            {ticket.perks && ticket.perks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ticket.perks.map((perk, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-(--accent) border border-(--card-border) text-xs font-semibold rounded-xl text-(--foreground)"
                  >
                    {perk}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-(--muted)">No special perks listed.</p>
            )}
          </div>
        </div>

        {/* Right column: Trip Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-(--foreground) leading-tight">{ticket.title}</h1>
            
            {/* Live Countdown */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-(--muted) uppercase tracking-wider">Departure Countdown</p>
              <Countdown targetDate={ticket.departureDateTime} />
            </div>

            {/* Path details */}
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-(--card-border)">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-(--muted) uppercase">From</p>
                <p className="text-sm font-bold flex items-center space-x-1 text-(--foreground)">
                  <MapPin className="h-4 w-4 text-violet-500 shrink-0" />
                  <span className="truncate">{ticket.from}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-(--muted) uppercase">To</p>
                <p className="text-sm font-bold flex items-center space-x-1 text-(--foreground)">
                  <MapPin className="h-4 w-4 text-violet-500 shrink-0" />
                  <span className="truncate">{ticket.to}</span>
                </p>
              </div>
            </div>

            {/* Departure parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-(--muted) uppercase">Departure Date</p>
                <p className="text-xs font-semibold flex items-center space-x-1 text-(--foreground)">
                  <Calendar className="h-4 w-4 text-violet-500 shrink-0" />
                  <span>{new Date(ticket.departureDateTime).toLocaleDateString()}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-(--muted) uppercase">Departure Time</p>
                <p className="text-xs font-semibold flex items-center space-x-1 text-(--foreground)">
                  <Clock className="h-4 w-4 text-violet-500 shrink-0" />
                  <span>{new Date(ticket.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </p>
              </div>
            </div>

            {/* Price and Stock info */}
            <div className="flex justify-between items-center bg-(--accent) border border-(--card-border) p-4 rounded-2xl mt-4">
              <div>
                <p className="text-[10px] text-(--muted) font-bold uppercase">Price per ticket</p>
                <p className="text-2xl font-black text-violet-600 dark:text-violet-400">৳{ticket.price}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-(--muted) font-bold uppercase">Available Seats</p>
                <p className={`text-sm font-bold ${isSoldOut ? "text-red-500" : "text-(--foreground)"}`}>
                  {isSoldOut ? "Sold Out" : `${ticket.quantity} Tickets`}
                </p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => setModalOpen(true)}
            disabled={isBookingDisabled}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform active:scale-95"
          >
            {isDeparturePassed
              ? "Departure Already Passed"
              : isSoldOut
              ? "Sold Out"
              : "Book Now"}
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-(--card-bg) border border-(--card-border) p-6 rounded-3xl shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
                <TicketIcon className="h-6 w-6 transform -rotate-12" />
                <h2 className="text-xl font-black text-(--foreground)">Book Seats</h2>
              </div>
              <button
                onClick={() => {
                  setModalOpen(false);
                  reset();
                }}
                className="text-(--muted) hover:text-red-500 font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-(--accent) border border-(--card-border) rounded-2xl space-y-2">
              <p className="text-sm font-bold text-(--foreground) truncate">{ticket.title}</p>
              <div className="flex justify-between text-xs text-(--muted)">
                <span>Unit Price: ৳{ticket.price}</span>
                <span>Max Available: {ticket.quantity}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleBookingSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-(--foreground) uppercase block">Quantity to Book</label>
                <input
                  type="number"
                  defaultValue={1}
                  {...register("quantity", {
                    required: "Quantity is required",
                    min: { value: 1, message: "Quantity must be at least 1" },
                    max: { value: ticket.quantity, message: `Cannot book more than ${ticket.quantity} tickets` },
                  })}
                  className="w-full px-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl text-sm focus:outline-none focus:border-violet-600 transition-colors"
                />
                {errors.quantity && (
                  <p className="text-[10px] text-red-500 font-semibold">{errors.quantity.message}</p>
                )}
              </div>

              {/* Total Price breakdown */}
              <div className="flex justify-between items-center border-t border-(--card-border) pt-4">
                <span className="text-xs text-(--muted) font-bold uppercase">Estimated Total</span>
                <span className="text-xl font-black text-violet-600 dark:text-violet-400">
                  ৳{ticket.price * (requestedQuantity > 0 ? requestedQuantity : 0)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    reset();
                  }}
                  className="py-3 px-4 border border-(--card-border) text-center text-sm font-semibold rounded-xl text-(--foreground) hover:bg-(--accent) transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading || errors.quantity}
                  className="py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-center text-sm font-bold rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center"
                >
                  {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
