"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star, Shield, HelpCircle, MapPin, Loader2, Compass, Bus, Train, Plane, Ship, Gift, BadgePercent } from "lucide-react";
import TicketCard from "@/components/TicketCard";

export default function Home() {
  const [allTickets, setAllTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://i.ibb.co/XnZmZSt/steam-train-chugs-through-mountain-forest-scene-generative-ai-188544-8072.avif",
    "https://i.ibb.co/HTFN7MsK/parikia-paros-gr-22-august-260nw-2680266843.webp",
    "https://i.ibb.co/bgJ9P3Jw/istockphoto-1465916031-612x612.webp"
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/api/tickets?limit=100`);
        if (res.ok) {
          const data = await res.json();
          setAllTickets(data.tickets || []);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchAllTickets();
  }, []);

  const busTickets = allTickets.filter((t) => t.transportType === "Bus");
  const trainTickets = allTickets.filter((t) => t.transportType === "Train");
  const planeTickets = allTickets.filter((t) => t.transportType === "Plane");
  const launchTickets = allTickets.filter((t) => t.transportType === "Launch");

  return (
    <div className="space-y-16 py-4">
      {/* Hero Banner Section */}
      <section 
        className="relative rounded-3xl overflow-hidden text-white py-24 px-8 sm:px-16 lg:px-24 shadow-2xl bg-cover bg-center border border-(--card-border) transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url('${heroImages[currentSlide]}')` }}
      >
        {/* Cinematic Gradient Overlays for rich depth & readability */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/65 via-transparent to-slate-950/35" />

        <div className="relative max-w-3xl space-y-8 text-left">
          {/* Sparkle Welcome Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-semibold tracking-wider uppercase text-violet-200 shadow-inner">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
            </span>
            <span>Welcome to TicketBari 🎫</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-md">
              Book Travel Tickets in Just a <span className="underline decoration-yellow-400 decoration-wavy decoration-3">Few Clicks</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-100 font-medium max-w-2xl leading-relaxed drop-shadow-sm">
              Discover and book flights, buses, trains, and launch tickets all across Bangladesh at the absolute best prices.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/tickets"
              className="flex items-center space-x-2 px-8 py-4 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 transform"
            >
              <span>Explore Tickets</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#why-choose-us"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/25 hover:border-white/40 backdrop-blur-md transition-all duration-300"
            >
              Learn More
            </a>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>100% Verified Seats</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* Discount & Promo Offers */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Special Promotions</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-(--foreground) mt-0.5">Exclusive Offers & Coupons</h2>
          </div>
          <p className="text-xs text-(--muted) max-w-xs">Use these codes during checkout to save big on your next journey!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Promo Card 1 */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-linear-to-br from-orange-500/10 via-rose-500/5 to-transparent border border-orange-500/20 group hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start">
                <div className="p-2 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
                  <Gift className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">First Booking</span>
              </div>
              <h3 className="text-lg font-black text-(--foreground) mt-4">Save 20% on Flights</h3>
              <p className="text-xs text-(--muted) mt-1">Get flat 20% discount on your first plane ticket booking.</p>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 group hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <BadgePercent className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Weekend Special</span>
              </div>
              <h3 className="text-lg font-black text-(--foreground) mt-4">10% Off on Bus Trips</h3>
              <p className="text-xs text-(--muted) mt-1">Enjoy a comfortable weekend trip with 10% cash back on buses.</p>
            </div>
          </div>

          {/* Promo Card 3 */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-linear-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 group hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Gift className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">VIP Launch</span>
              </div>
              <h3 className="text-lg font-black text-(--foreground) mt-4">৳৫০০ Off on Cabins</h3>
              <p className="text-xs text-(--muted) mt-1">Book launch double or VIP cabins and save flat ৳৫০০ instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Tickets Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-(--card-border) pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 rounded-xl text-orange-600 dark:text-orange-400 shadow-sm">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Comfortable Journeys</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-(--foreground) mt-0.5">Bus Tickets</h2>
            </div>
          </div>
          <Link href="/tickets?transportType=Bus" className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center space-x-1">
            <span>View All Bus</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingTickets ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        ) : busTickets.length === 0 ? (
          <div className="text-center py-12 bg-(--card-bg) border border-(--card-border) rounded-2xl p-6 text-(--muted) text-sm">
            No bus tickets available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {busTickets.slice(0, 4).map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* Train Tickets Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-(--card-border) pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
              <Train className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Scenic & Safe Commutes</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-(--foreground) mt-0.5">Train Tickets</h2>
            </div>
          </div>
          <Link href="/tickets?transportType=Train" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1">
            <span>View All Train</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingTickets ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : trainTickets.length === 0 ? (
          <div className="text-center py-12 bg-(--card-bg) border border-(--card-border) rounded-2xl p-6 text-(--muted) text-sm">
            No train tickets available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trainTickets.slice(0, 4).map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* Flight Tickets Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-(--card-border) pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Premium Air Travel</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-(--foreground) mt-0.5">Flight Tickets</h2>
            </div>
          </div>
          <Link href="/tickets?transportType=Plane" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
            <span>View All Flight</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingTickets ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : planeTickets.length === 0 ? (
          <div className="text-center py-12 bg-(--card-bg) border border-(--card-border) rounded-2xl p-6 text-(--muted) text-sm">
            No flight tickets available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {planeTickets.slice(0, 4).map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* Launch Tickets Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-(--card-border) pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-100 dark:bg-cyan-950/40 rounded-xl text-cyan-600 dark:text-cyan-400 shadow-sm">
              <Ship className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Relaxing River Cruising</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-(--foreground) mt-0.5">Launch Tickets</h2>
            </div>
          </div>
          <Link href="/tickets?transportType=Launch" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1">
            <span>View All Launch</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingTickets ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
          </div>
        ) : launchTickets.length === 0 ? (
          <div className="text-center py-12 bg-(--card-bg) border border-(--card-border) rounded-2xl p-6 text-(--muted) text-sm">
            No launch tickets available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {launchTickets.slice(0, 4).map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* Live Stats Bar */}
      <section className="bg-linear-to-r from-violet-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black">50K+</h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-violet-200">Active Customers</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black">150+</h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-violet-200">Verified Operators</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black">99.9%</h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-violet-200">Successful Bookings</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black">24/7</h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-violet-200">Customer Support</p>
          </div>
        </div>
      </section>

      {/* Extra Section 2: Why Choose Us? */}
      <section id="why-choose-us" className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Features</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-(--foreground)">Why Choose TicketBari?</h2>
          <p className="text-sm text-(--muted)">
            We provide a hassle-free booking experience with top-tier security and instant delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1 */}
          <div className="text-center space-y-4 p-6 bg-(--card-bg) border border-(--card-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="inline-flex p-3 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-2xl shadow-inner">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-(--foreground)">Instant Confirmation</h3>
            <p className="text-xs text-(--muted) leading-relaxed">
              Get your ticket confirmed immediately and check the live countdown on your dashboard.
            </p>
          </div>

          {/* Card 2 */}
          <div className="text-center space-y-4 p-6 bg-(--card-bg) border border-(--card-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="inline-flex p-3 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-2xl shadow-inner">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-(--foreground)">Secure Payments</h3>
            <p className="text-xs text-(--muted) leading-relaxed">
              All transactions are secured and processed using Stripe with support for multiple payment networks.
            </p>
          </div>

          {/* Card 3 */}
          <div className="text-center space-y-4 p-6 bg-(--card-bg) border border-(--card-border) rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="inline-flex p-3 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-2xl shadow-inner">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-(--foreground)">Wide Coverage</h3>
            <p className="text-xs text-(--muted) leading-relaxed">
              Search tickets for buses, trains, launches, and planes all over Bangladesh in a single search engine.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Help Center</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-(--foreground)">Frequently Asked Questions</h2>
          <p className="text-sm text-(--muted)">Got questions? We have got the answers right here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-(--card-bg) border border-(--card-border) p-6 rounded-2xl space-y-2 hover:border-violet-500/30 transition-all">
            <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
              <HelpCircle className="h-5 w-5 shrink-0" />
              <h3 className="font-bold text-sm text-(--foreground)">How do I receive my booked ticket?</h3>
            </div>
            <p className="text-xs text-(--muted) pl-7 leading-relaxed">
              Once your payment is successfully completed, your ticket will be confirmed immediately. You will receive an SMS and an email copy of your ticket. You can also view and download it from your User Dashboard.
            </p>
          </div>

          <div className="bg-(--card-bg) border border-(--card-border) p-6 rounded-2xl space-y-2 hover:border-violet-500/30 transition-all">
            <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
              <HelpCircle className="h-5 w-5 shrink-0" />
              <h3 className="font-bold text-sm text-(--foreground)">Can I cancel or refund my ticket?</h3>
            </div>
            <p className="text-xs text-(--muted) pl-7 leading-relaxed">
              Yes, ticket cancellation and refunds are supported depending on the operator&apos;s policies. You can cancel your ticket directly from your Dashboard up to 12 hours before the travel time. Refunds will be processed within 3-5 business days.
            </p>
          </div>

          <div className="bg-(--card-bg) border border-(--card-border) p-6 rounded-2xl space-y-2 hover:border-violet-500/30 transition-all">
            <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
              <HelpCircle className="h-5 w-5 shrink-0" />
              <h3 className="font-bold text-sm text-(--foreground)">What payment methods do you support?</h3>
            </div>
            <p className="text-xs text-(--muted) pl-7 leading-relaxed">
              We support a wide variety of secure payment methods, including major credit/debit cards (Visa, Mastercard, American Express), mobile banking (bKash, Nagad, Rocket), and internet banking via Stripe and other secure channels.
            </p>
          </div>

          <div className="bg-(--card-bg) border border-(--card-border) p-6 rounded-2xl space-y-2 hover:border-violet-500/30 transition-all">
            <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
              <HelpCircle className="h-5 w-5 shrink-0" />
              <h3 className="font-bold text-sm text-(--foreground)">Is there any extra fee or charge?</h3>
            </div>
            <p className="text-xs text-(--muted) pl-7 leading-relaxed">
              No, TicketBari is committed to absolute transparency. We do not charge any hidden booking fees. The final price you see at the payment step is exactly what you pay.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
