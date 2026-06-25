"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiFetch } from "@/lib/api";
import { showToast } from "@/lib/toast";
import Countdown from "@/components/Countdown";
import { useForm } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import {
  User as UserIcon,
  Ticket as TicketIcon,
  History,
  PlusCircle,
  List,
  Inbox,
  BarChart3,
  Settings,
  Users,
  Megaphone,
  Upload,
  Loader2,
  Check,
  X,
  ShieldAlert,
  Edit,
  Trash,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex flex-col justify-center items-center py-24 space-y-4"><Loader2 className="h-10 w-10 animate-spin text-violet-600" /><p className="text-sm text-(--muted)">Loading Dashboard...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, logout, loading: authLoading } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected tab based on role
  const [activeTab, setActiveTab] = useState("profile");

  // Data states
  const [myBookings, setMyBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [vendorTickets, setVendorTickets] = useState([]);
  const [vendorBookings, setVendorBookings] = useState([]);
  const [revenueData, setRevenueData] = useState(null);

  const [adminTickets, setAdminTickets] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // Loading states
  const [dataLoading, setDataLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // stores ID of item being updated

  // Edit ticket modal state
  const [editingTicket, setEditingTicket] = useState(null);

  // Confetti / payment success notification
  const [showSuccessToast, setShowSuccessToast] = useState("");

  // Stripe Session Redirect confirmation
  useEffect(() => {
    if (!user) return;

    const sessionId = searchParams.get("session_id");
    const bookingId = searchParams.get("booking_id");

    if (sessionId && bookingId) {
      confirmPayment(sessionId, bookingId);
    }

    if (searchParams.get("payment_failed")) {
      showToast({ message: "Payment failed or was cancelled. Please try again.", type: "warning" });
      router.replace("/dashboard");
    }
  }, [searchParams, user]);

  const confirmPayment = async (sessionId, bookingId) => {
    setPaymentProcessing(true);
    try {
      const res = await apiFetch("/api/payments/confirm", {
        method: "POST",
        body: JSON.stringify({ sessionId, bookingId }),
      });
      showToast({ message: "Payment confirmed successfully! Ticket quantity reduced.", type: "success" });
      setShowSuccessToast("Payment confirmed successfully! Ticket quantity reduced.");
      setTimeout(() => setShowSuccessToast(""), 5000);
      router.replace("/dashboard");
      fetchTabValues();
    } catch (err) {
      showToast({ message: err.message || "Failed to confirm payment.", type: "error" });
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Fetch relevant data on tab change or mount
  useEffect(() => {
    if (!user) {
      if (!authLoading) {
        router.push("/login");
      }
      return;
    }

    fetchTabValues();
  }, [activeTab, user, authLoading]);

  const fetchTabValues = async () => {
    setDataLoading(true);
    try {
      if (user.role === "user") {
        if (activeTab === "bookings") {
          const data = await apiFetch("/api/bookings/my-bookings");
          setMyBookings(data);
        } else if (activeTab === "transactions") {
          const data = await apiFetch("/api/payments/transactions");
          setTransactions(data);
        }
      } else if (user.role === "vendor") {
        if (activeTab === "my-tickets") {
          const data = await apiFetch("/api/tickets/vendor");
          setVendorTickets(data);
        } else if (activeTab === "requested") {
          const data = await apiFetch("/api/bookings/requested");
          setVendorBookings(data);
        } else if (activeTab === "revenue") {
          const data = await apiFetch("/api/payments/revenue-overview");
          setRevenueData(data);
        }
      } else if (user.role === "admin") {
        if (activeTab === "manage-tickets") {
          const data = await apiFetch("/api/tickets/admin/all");
          setAdminTickets(data);
        } else if (activeTab === "manage-users") {
          const data = await apiFetch("/api/users");
          setAdminUsers(data);
        } else if (activeTab === "advertise") {
          const data = await apiFetch("/api/tickets/admin/all");
          setAdminTickets(data);
        }
      }
    } catch (err) {
      console.error("Fetch tab data error:", err);
    } finally {
      setDataLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        <p className="text-sm text-(--muted)">Loading Dashboard...</p>
      </div>
    );
  }

  // Common styles
  const sidebarItems = {
    user: [
      { id: "profile", label: "My Profile", icon: UserIcon },
      { id: "bookings", label: "My Booked Tickets", icon: TicketIcon },
      { id: "transactions", label: "Transaction History", icon: History },
    ],
    vendor: [
      { id: "profile", label: "Vendor Profile", icon: UserIcon },
      { id: "add-ticket", label: "Add Ticket", icon: PlusCircle },
      { id: "my-tickets", label: "My Added Tickets", icon: List },
      { id: "requested", label: "Requested Bookings", icon: Inbox },
      { id: "revenue", label: "Revenue Overview", icon: BarChart3 },
    ],
    admin: [
      { id: "profile", label: "Admin Profile", icon: UserIcon },
      { id: "manage-tickets", label: "Manage Tickets", icon: List },
      { id: "manage-users", label: "Manage Users", icon: Users },
      { id: "advertise", label: "Advertise Tickets", icon: Megaphone },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4">
      {/* Toast notifications */}
      {showSuccessToast && (
        <div className="fixed top-20 right-8 z-50 p-4 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200 border border-green-200 dark:border-green-900 rounded-2xl shadow-lg font-bold text-xs animate-in slide-in-from-right-4 duration-300">
          ✓ {showSuccessToast}
        </div>
      )}

      {paymentProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm">
          <div className="bg-(--card-bg) p-6 rounded-2xl border border-(--card-border) flex flex-col items-center space-y-4 shadow-xl">
            <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
            <p className="text-sm font-bold">Verifying payment with Stripe...</p>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0 bg-(--card-bg) border border-(--card-border) p-6 rounded-3xl shadow-sm space-y-6 self-start">
        <div className="text-center pb-4 border-b border-(--card-border) space-y-3">
          <img
            src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"}
            alt={user.name}
            className="h-16 w-16 rounded-full border-4 border-violet-600 object-cover mx-auto"
          />
          <div>
            <h2 className="text-base font-bold text-(--foreground) truncate">{user.name}</h2>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100 rounded-full capitalize">
              {user.role} Dashboard
            </span>
          </div>
        </div>

        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 pb-2 lg:pb-0">
          {(sidebarItems[user.role] || sidebarItems['user']).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${activeTab === item.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-(--foreground) opacity-70 hover:bg-(--accent) hover:text-violet-600"
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="w-full py-2.5 border border-red-200 dark:border-red-950 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold rounded-xl transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main View Area */}
      <main className="grow bg-(--card-bg) border border-(--card-border) rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Render Tab View */}
        {activeTab === "profile" && <ProfileView user={user} />}

        {/* User Specific Tabs */}
        {user.role === "user" && activeTab === "bookings" && (
          <UserBookings
            bookings={myBookings}
            loading={dataLoading}
            actionLoading={actionLoading}
            setActionLoading={setActionLoading}
            setBookings={setMyBookings}
            fetchTabValues={fetchTabValues}
          />
        )}
        {user.role === "user" && activeTab === "transactions" && (
          <UserTransactions transactions={transactions} loading={dataLoading} />
        )}

        {/* Vendor Specific Tabs */}
        {user.role === "vendor" && activeTab === "add-ticket" && <AddTicketView user={user} setActiveTab={setActiveTab} />}
        {user.role === "vendor" && activeTab === "my-tickets" && (
          <VendorTickets
            tickets={vendorTickets}
            loading={dataLoading}
            actionLoading={actionLoading}
            setActionLoading={setActionLoading}
            setTickets={setVendorTickets}
            editingTicket={editingTicket}
            setEditingTicket={setEditingTicket}
            fetchTabValues={fetchTabValues}
          />
        )}
        {user.role === "vendor" && activeTab === "requested" && (
          <VendorRequestedBookings
            bookings={vendorBookings}
            loading={dataLoading}
            actionLoading={actionLoading}
            setActionLoading={setActionLoading}
            setBookings={setVendorBookings}
          />
        )}
        {user.role === "vendor" && activeTab === "revenue" && (
          <VendorRevenue revenueData={revenueData} loading={dataLoading} />
        )}

        {/* Admin Specific Tabs */}
        {user.role === "admin" && activeTab === "manage-tickets" && (
          <AdminTickets
            tickets={adminTickets}
            loading={dataLoading}
            actionLoading={actionLoading}
            setActionLoading={setActionLoading}
            setTickets={setAdminTickets}
          />
        )}
        {user.role === "admin" && activeTab === "manage-users" && (
          <AdminUsers
            users={adminUsers}
            loading={dataLoading}
            actionLoading={actionLoading}
            setActionLoading={setActionLoading}
            setUsers={setAdminUsers}
          />
        )}
        {user.role === "admin" && activeTab === "advertise" && (
          <AdminAdvertise
            tickets={adminTickets}
            loading={dataLoading}
            actionLoading={actionLoading}
            setActionLoading={setActionLoading}
            setTickets={setAdminTickets}
          />
        )}
      </main>

      {/* Edit Ticket Modal for Vendors */}
      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          setTicket={setEditingTicket}
          onSuccess={() => {
            setEditingTicket(null);
            fetchTabValues();
          }}
        />
      )}
    </div>
  );
}

/* SUBCOMPONENTS FOR EACH TAB */

// 1. Profile View
function ProfileView({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-(--foreground)">Profile Information</h2>
        <p className="text-xs text-(--muted)">Your account credentials and details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-(--accent) border border-(--card-border) p-6 rounded-2xl">
        <div className="space-y-1">
          <p className="text-[10px] text-(--muted) font-bold uppercase">Full Name</p>
          <p className="text-sm font-bold text-(--foreground)">{user.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-(--muted) font-bold uppercase">Email Address</p>
          <p className="text-sm font-bold text-(--foreground)">{user.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-(--muted) font-bold uppercase">Role Permission</p>
          <p className="text-sm font-bold capitalize text-violet-600 dark:text-violet-400">{user.role}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-(--muted) font-bold uppercase">Account Status</p>
          <p className={`text-sm font-bold capitalize ${user.status === "fraud" ? "text-red-500" : "text-green-500"}`}>
            {user.status || "Active"}
          </p>
        </div>
      </div>
    </div>
  );
}

// 2. User Bookings
function UserBookings({ bookings, loading, actionLoading, setActionLoading, setBookings, fetchTabValues }) {
  const router = useRouter();

  const handlePayNow = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      const { id: sessionId, url } = await apiFetch(`/api/bookings/${bookingId}/checkout-session`, {
        method: "POST",
      });

      // Redirect directly to Stripe url
      window.location.href = url;
    } catch (err) {
      showToast({ message: err.message || "Failed to initiate payment.", type: "error" });
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setActionLoading(bookingId);
    try {
      await apiFetch(`/api/bookings/cancel/${bookingId}`, { method: "POST" });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      showToast({ message: "Booking cancelled successfully.", type: "success" });
    } catch (err) {
      showToast({ message: err.message || "Failed to cancel booking.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-(--muted) text-sm">
        You have not booked any tickets yet.{" "}
        <Link href="/tickets" className="text-violet-600 hover:underline font-bold">
          Browse Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-(--foreground)">My Booked Tickets</h2>
        <p className="text-xs text-(--muted)">Track status, check departure, and complete payments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => {
          const isDeparturePassed = new Date(booking.departureDateTime) <= new Date();
          const canPay = booking.status === "accepted" && !isDeparturePassed;
          const canCancel = booking.status === "pending";

          return (
            <div key={booking._id} className="border border-(--card-border) rounded-2xl overflow-hidden bg-(--accent) p-5 space-y-4">
              <div className="flex space-x-4">
                <img
                  src={booking.ticketImage}
                  alt={booking.ticketTitle}
                  className="h-16 w-16 object-cover rounded-xl border border-(--card-border)"
                />
                <div className="space-y-1 truncate">
                  <h3 className="text-sm font-bold text-(--foreground) truncate">{booking.ticketTitle}</h3>
                  <p className="text-xs text-(--muted) flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-violet-500 shrink-0" />
                    <span className="truncate">{booking.from} → {booking.to}</span>
                  </p>
                </div>
              </div>

              {/* Status and Countdown */}
              <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-(--card-border)">
                <div>
                  <p className="text-[9px] text-(--muted) uppercase font-bold">Booking Status</p>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full capitalize ${booking.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking.status === "accepted"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                    }`}>
                    {booking.status}
                  </span>
                </div>
                {booking.status !== "rejected" && (
                  <div>
                    <p className="text-[9px] text-(--muted) uppercase font-bold text-right">Time Left</p>
                    <Countdown targetDate={booking.departureDateTime} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 bg-(--card-bg) px-3 rounded-xl border border-(--card-border)">
                <div>
                  <p className="text-[9px] text-(--muted) uppercase font-bold">Qty booked</p>
                  <p className="font-bold text-(--foreground)">{booking.quantity} Seats</p>
                </div>
                <div>
                  <p className="text-[9px] text-(--muted) uppercase font-bold">Total Cost</p>
                  <p className="font-black text-violet-600 dark:text-violet-400">৳{booking.totalPrice}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                {canPay && (
                  <button
                    onClick={() => handlePayNow(booking._id)}
                    disabled={actionLoading === booking._id}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center"
                  >
                    {actionLoading === booking._id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay Now"}
                  </button>
                )}
                {isDeparturePassed && booking.status !== "paid" && (
                  <p className="w-full text-center text-xs text-red-500 font-semibold py-2">
                    Payment disabled (Departure passed)
                  </p>
                )}
                {canCancel && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={actionLoading === booking._id}
                    className="w-full py-2 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs transition-colors flex items-center justify-center"
                  >
                    {actionLoading === booking._id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel Booking"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. User Transactions
function UserTransactions({ transactions, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return <div className="text-center py-12 text-(--muted) text-sm">No transaction records found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-(--foreground)">Transaction History</h2>
        <p className="text-xs text-(--muted)">Log of all secure payments made via Stripe.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-(--card-border) bg-(--accent)">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-violet-50 dark:bg-violet-950 text-violet-800 dark:text-violet-200 border-b border-(--card-border)">
              <th className="p-4 font-bold">Transaction ID</th>
              <th className="p-4 font-bold">Ticket Title</th>
              <th className="p-4 font-bold">Amount Paid</th>
              <th className="p-4 font-bold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--card-border)">
            {transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-(--card-bg) text-(--foreground) transition-colors">
                <td className="p-4 font-mono font-bold select-all text-violet-600 dark:text-violet-400">{tx.transactionId}</td>
                <td className="p-4 font-bold truncate max-w-37.5">{tx.ticketTitle}</td>
                <td className="p-4 font-black">৳{tx.amount}</td>
                <td className="p-4 text-(--muted)">{new Date(tx.paymentDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4. Vendor Add Ticket
function AddTicketView({ user, setActiveTab }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setUploadedUrl("");
    setUploadingImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "6a13d702d0cf3b6033a207212003c00f";
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      const remoteUrl = data?.data?.url || "";
      setUploadedUrl(remoteUrl);
      if (remoteUrl) {
        setPreviewUrl(remoteUrl);
      }
    } catch (err) {
      setUploadedUrl("");
      showToast({ message: "Selected image preview is shown. The upload is still being processed.", type: "warning" });
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (formData) => {
    const imageForSubmission = uploadedUrl || previewUrl;
    if (!imageForSubmission) {
      showToast({ message: "Please select an image first.", type: "warning" });
      return;
    }

    setLoading(true);
    try {
      // Perks checklist mapping
      const selectedPerks = [];
      if (formData.perkAC) selectedPerks.push("AC");
      if (formData.perkWiFi) selectedPerks.push("WiFi");
      if (formData.perkBreakfast) selectedPerks.push("Breakfast");
      if (formData.perkWater) selectedPerks.push("Water Bottle");

      await apiFetch("/api/tickets", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          from: formData.from,
          to: formData.to,
          transportType: formData.transportType,
          price: formData.price,
          quantity: formData.quantity,
          departureDateTime: formData.departureDateTime,
          perks: selectedPerks,
          image: imageForSubmission,
        }),
      });

      reset();
      setUploadedUrl("");
      setPreviewUrl("");
      setImageFile(null);
      setActiveTab("my-tickets");
    } catch (err) {
      showToast({ message: err.message || "Failed to create ticket.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-(--foreground)">Add Travel Ticket</h2>
        <p className="text-xs text-(--muted)">Add a new route. Submissions will be pending admin review.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-bold">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase tracking-wider block">Ticket/Trip Title</label>
            <input
              type="text"
              required
              placeholder="Ex: Hanif Enterprise AC Bus Dhaka to Cox"
              {...register("title", { required: true })}
              className="w-full px-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase tracking-wider block">Transport Type</label>
            <select
              required
              {...register("transportType", { required: true })}
              className="w-full px-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600 transition-colors"
            >
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Launch">Launch</option>
              <option value="Plane">Plane</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase tracking-wider block">From (Departure Location)</label>
            <input
              type="text"
              required
              placeholder="Ex: Dhaka"
              {...register("from", { required: true })}
              className="w-full px-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase tracking-wider block">To (Destination Location)</label>
            <input
              type="text"
              required
              placeholder="Ex: Cox's Bazar"
              {...register("to", { required: true })}
              className="w-full px-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase tracking-wider block">Price (৳)</label>
            <input
              type="number"
              required
              placeholder="Ex: 1200"
              {...register("price", { required: true, min: 1 })}
              className="w-full px-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase tracking-wider block">Quantity (Available Seats)</label>
            <input
              type="number"
              required
              placeholder="Ex: 40"
              {...register("quantity", { required: true, min: 1 })}
              className="w-full px-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase tracking-wider block">Departure Date & Time</label>
            <input
              type="datetime-local"
              required
              {...register("departureDateTime", { required: true })}
              className="w-full px-4 py-2.5 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>
        </div>

        {/* Read-only vendor details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase block">Vendor Name</label>
            <input
              type="text"
              readOnly
              value={user.name}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 border border-(--card-border) rounded-xl cursor-not-allowed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase block">Vendor Email</label>
            <input
              type="text"
              readOnly
              value={user.email}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 border border-(--card-border) rounded-xl cursor-not-allowed"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-1">
          <label className="text-[10px] text-(--muted) uppercase tracking-wider block">Ticket Route Image (via Imgbb)</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 px-4 py-2.5 bg-violet-600 text-white border border-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 rounded-xl cursor-pointer transition-colors shadow-sm">
              <Upload className="h-4 w-4" />
              <span className="font-semibold">Choose Image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {uploadingImage && <Loader2 className="h-5 w-5 animate-spin text-violet-600" />}
            {previewUrl && (
              <div className="flex items-center space-x-2 text-green-600 text-xs">
                <span>{uploadedUrl ? "Image uploaded successfully!" : "Image selected"}</span>
                <img src={previewUrl} alt="Selected ticket preview" className="h-8 w-8 object-cover rounded-lg border border-(--card-border)" />
              </div>
            )}
          </div>
        </div>

        {/* Perks Checkboxes */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] text-(--muted) uppercase tracking-wider block">Available Perks</label>
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" {...register("perkAC")} className="rounded text-violet-600 focus:ring-violet-500 h-4 w-4" />
              <span>AC (Air Conditioned)</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" {...register("perkWiFi")} className="rounded text-violet-600 focus:ring-violet-500 h-4 w-4" />
              <span>Free WiFi</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" {...register("perkBreakfast")} className="rounded text-violet-600 focus:ring-violet-500 h-4 w-4" />
              <span>Free Breakfast</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" {...register("perkWater")} className="rounded text-violet-600 focus:ring-violet-500 h-4 w-4" />
              <span>Complimentary Water</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="w-full flex items-center justify-center py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add Travel Ticket"}
        </button>
      </form>
    </div>
  );
}

// 5. Vendor Added Tickets
function VendorTickets({ tickets, loading, actionLoading, setActionLoading, setTickets, setEditingTicket, fetchTabValues }) {
  const handleDelete = async (ticketId) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    setActionLoading(ticketId);
    try {
      await apiFetch(`/api/tickets/${ticketId}`, { method: "DELETE" });
      setTickets((prev) => prev.filter((t) => t._id !== ticketId));
    } catch (err) {
      showToast({ message: err.message || "Failed to delete ticket.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return <div className="text-center py-12 text-(--muted) text-sm">No tickets added yet.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-(--foreground)">My Added Tickets</h2>
        <p className="text-xs text-(--muted)">Manage routes and view admin verification status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((ticket) => {
          const isRejected = ticket.verificationStatus === "rejected";

          return (
            <div key={ticket._id} className="border border-(--card-border) rounded-2xl overflow-hidden bg-(--accent) p-5 space-y-4">
              <div className="flex space-x-4">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="h-16 w-16 object-cover rounded-xl border border-(--card-border)"
                />
                <div className="space-y-1 truncate">
                  <h3 className="text-sm font-bold text-(--foreground) truncate">{ticket.title}</h3>
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded-full capitalize ${ticket.verificationStatus === "approved"
                      ? "bg-green-100 text-green-800"
                      : ticket.verificationStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {ticket.verificationStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 bg-(--card-bg) px-3 rounded-xl border border-(--card-border)">
                <div>
                  <p className="text-[9px] text-(--muted) uppercase font-bold">Pricing</p>
                  <p className="font-bold text-(--foreground)">৳{ticket.price}</p>
                </div>
                <div>
                  <p className="text-[9px] text-(--muted) uppercase font-bold">Qty Remaining</p>
                  <p className="font-bold text-(--foreground)">{ticket.quantity} Tickets</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingTicket(ticket)}
                  disabled={isRejected || actionLoading === ticket._id}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 border border-violet-200 text-violet-600 hover:bg-violet-50 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl text-xs font-bold transition-all"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Update</span>
                </button>
                <button
                  onClick={() => handleDelete(ticket._id)}
                  disabled={isRejected || actionLoading === ticket._id}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl text-xs font-bold transition-all"
                >
                  {actionLoading === ticket._id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Trash className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Edit Ticket Modal
function EditTicketModal({ ticket, setTicket, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: ticket.title,
      from: ticket.from,
      to: ticket.to,
      price: ticket.price,
      quantity: ticket.quantity,
      departureDateTime: new Date(ticket.departureDateTime).toISOString().slice(0, 16),
    }
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await apiFetch(`/api/tickets/${ticket._id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      onSuccess();
    } catch (err) {
      showToast({ message: err.message || "Failed to update ticket.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-(--card-bg) border border-(--card-border) p-6 rounded-3xl shadow-xl space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-black text-(--foreground)">Update Ticket</h2>
          <button onClick={() => setTicket(null)} className="text-(--muted) hover:text-red-500 font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-bold">
          <div className="space-y-1">
            <label className="text-[10px] text-(--muted) uppercase block">Title</label>
            <input
              type="text"
              required
              {...register("title", { required: true })}
              className="w-full px-4 py-2 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-(--muted) uppercase block">From</label>
              <input
                type="text"
                required
                {...register("from", { required: true })}
                className="w-full px-4 py-2 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-(--muted) uppercase block">To</label>
              <input
                type="text"
                required
                {...register("to", { required: true })}
                className="w-full px-4 py-2 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-(--muted) uppercase block">Price</label>
              <input
                type="number"
                required
                {...register("price", { required: true, min: 1 })}
                className="w-full px-4 py-2 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-(--muted) uppercase block">Qty</label>
              <input
                type="number"
                required
                {...register("quantity", { required: true, min: 1 })}
                className="w-full px-4 py-2 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-(--muted) uppercase block">Departure</label>
              <input
                type="datetime-local"
                required
                {...register("departureDateTime", { required: true })}
                className="w-full px-4 py-2 bg-(--accent) border border-(--card-border) rounded-xl focus:outline-none focus:border-violet-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => setTicket(null)}
              className="py-2.5 border border-(--card-border) rounded-xl hover:bg-(--accent)"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-sm flex justify-center items-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 6. Vendor Booking Requests (Table)
function VendorRequestedBookings({ bookings, loading, actionLoading, setActionLoading, setBookings }) {
  const handleAction = async (bookingId, action) => {
    setActionLoading(bookingId);
    try {
      const updated = await apiFetch(`/api/bookings/${bookingId}/${action}`, { method: "PUT" });
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: updated.status } : b)));
    } catch (err) {
      showToast({ message: err.message || "Failed to update booking status.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return <div className="text-center py-12 text-(--muted) text-sm">No booking requests received yet.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-(--foreground)">Requested Bookings</h2>
        <p className="text-xs text-(--muted)">Approve or reject booking requests made by users.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-(--card-border) bg-(--accent)">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-violet-50 dark:bg-violet-950 text-violet-800 dark:text-violet-200 border-b border-(--card-border)">
              <th className="p-4 font-bold">User Information</th>
              <th className="p-4 font-bold">Ticket Route</th>
              <th className="p-4 font-bold">Qty</th>
              <th className="p-4 font-bold">Total (৳)</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--card-border)">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-(--card-bg) text-(--foreground) transition-colors">
                <td className="p-4">
                  <div className="font-bold">{booking.userName}</div>
                  <div className="text-[10px] text-(--muted)">{booking.userEmail}</div>
                </td>
                <td className="p-4 font-bold max-w-37.5 truncate">{booking.ticketTitle}</td>
                <td className="p-4 font-bold">{booking.quantity}</td>
                <td className="p-4 font-black">৳{booking.totalPrice}</td>
                <td className="p-4">
                  {booking.status === "pending" ? (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleAction(booking._id, "accept")}
                        disabled={actionLoading === booking._id}
                        className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                        title="Accept"
                      >
                        {actionLoading === booking._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleAction(booking._id, "reject")}
                        disabled={actionLoading === booking._id}
                        className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        title="Reject"
                      >
                        {actionLoading === booking._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center font-bold capitalize text-(--muted)">{booking.status}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 7. Vendor Revenue Charts
function VendorRevenue({ revenueData, loading }) {
  if (loading || !revenueData) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  // Format chart data
  const chartData = revenueData.salesByTicket?.map((t) => ({
    name: t.title.substring(0, 15) + "...",
    Revenue: t.revenue,
    TicketsSold: t.quantitySold,
  })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-(--foreground)">Revenue Overview</h2>
        <p className="text-xs text-(--muted)">Monitor total added tickets, sales, and total revenue.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-(--accent) border border-(--card-border) p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-(--muted) uppercase">Total Added</p>
            <p className="text-2xl font-black text-(--foreground)">{revenueData.totalTicketsAdded}</p>
          </div>
        </div>

        <div className="bg-(--accent) border border-(--card-border) p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
            <TicketIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-(--muted) uppercase">Tickets Sold</p>
            <p className="text-2xl font-black text-(--foreground)">{revenueData.totalTicketsSold}</p>
          </div>
        </div>

        <div className="bg-(--accent) border border-(--card-border) p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-(--muted) uppercase">Total Revenue</p>
            <p className="text-2xl font-black text-green-600 dark:text-green-400">৳{revenueData.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      {chartData.length > 0 && (
        <div className="bg-(--accent) border border-(--card-border) p-4 rounded-2xl h-80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-(--muted) mb-4 flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span>Revenue Breakdown By Route (৳)</span>
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" fontSize={9} />
              <YAxis fontSize={9} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                  color: "var(--foreground)",
                  fontSize: "11px",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="Revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// 8. Admin Tickets View (Table)
function AdminTickets({ tickets, loading, actionLoading, setActionLoading, setTickets }) {
  const handleAction = async (ticketId, status) => {
    setActionLoading(ticketId);
    try {
      await apiFetch(`/api/tickets/${ticketId}/${status}`, { method: "PUT" });
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, verificationStatus: status } : t))
      );
    } catch (err) {
      showToast({ message: err.message || `Failed to ${status} ticket.`, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return <div className="text-center py-12 text-(--muted) text-sm">No vendor tickets submitted.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-(--foreground)">Manage Vendor Tickets</h2>
        <p className="text-xs text-(--muted)">Approve or reject routes posted by active vendors.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-(--card-border) bg-(--accent)">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-violet-50 dark:bg-violet-950 text-violet-800 dark:text-violet-200 border-b border-(--card-border)">
              <th className="p-4 font-bold">Ticket Details</th>
              <th className="p-4 font-bold">Vendor</th>
              <th className="p-4 font-bold">Pricing</th>
              <th className="p-4 font-bold text-center">Status</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--card-border)">
            {tickets.map((t) => (
              <tr key={t._id} className="hover:bg-(--card-bg) text-(--foreground) transition-colors">
                <td className="p-4">
                  <div className="font-bold truncate max-w-37.5">{t.title}</div>
                  <div className="text-[10px] text-(--muted)">{t.transportType} | {t.from} → {t.to}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold">{t.vendorName}</div>
                  <div className="text-[10px] text-(--muted)">{t.vendorEmail}</div>
                </td>
                <td className="p-4 font-bold">৳{t.price} ({t.quantity} seats)</td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded-full capitalize ${t.verificationStatus === "approved"
                      ? "bg-green-100 text-green-800"
                      : t.verificationStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {t.verificationStatus}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleAction(t._id, "approve")}
                      disabled={t.verificationStatus === "approved" || actionLoading === t._id}
                      className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 disabled:opacity-40 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAction(t._id, "reject")}
                      disabled={t.verificationStatus === "rejected" || actionLoading === t._id}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 disabled:opacity-40 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 9. Admin Users View (Table)
function AdminUsers({ users, loading, actionLoading, setActionLoading, setUsers }) {
  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      const updated = await apiFetch(`/api/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: updated.role } : u)));
    } catch (err) {
      showToast({ message: err.message || "Failed to update role.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkFraud = async (userId) => {
    if (!confirm("Are you sure you want to mark this vendor as fraud? This will reject all their tickets and ban their profile!")) return;
    setActionLoading(userId);
    try {
      await apiFetch(`/api/users/${userId}/fraud`, { method: "PUT" });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: "fraud" } : u)));
      showToast({ message: "Vendor marked as fraud. All associated tickets have been rejected.", type: "success" });
    } catch (err) {
      showToast({ message: err.message || "Failed to mark vendor as fraud.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-(--foreground)">Manage Platform Users</h2>
        <p className="text-xs text-(--muted)">Manage permissions, update user roles, and flag fraud vendors.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-(--card-border) bg-(--accent)">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-violet-50 dark:bg-violet-950 text-violet-800 dark:text-violet-200 border-b border-(--card-border)">
              <th className="p-4 font-bold">User Profile</th>
              <th className="p-4 font-bold">Role</th>
              <th className="p-4 font-bold text-center">Status</th>
              <th className="p-4 font-bold text-center">Update Role</th>
              <th className="p-4 font-bold text-center">Ban / Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--card-border)">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-(--card-bg) text-(--foreground) transition-colors">
                <td className="p-4">
                  <div className="font-bold">{u.name}</div>
                  <div className="text-[10px] text-(--muted)">{u.email}</div>
                </td>
                <td className="p-4 font-bold capitalize text-violet-600 dark:text-violet-400">{u.role}</td>
                <td className="p-4 text-center font-bold">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] capitalize ${u.status === "fraud" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                    {u.status || "Active"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center space-x-1.5">
                    <button
                      onClick={() => handleRoleChange(u._id, "vendor")}
                      disabled={u.role === "vendor" || actionLoading === u._id}
                      className="px-2 py-1 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded text-[10px] font-bold transition-colors disabled:opacity-40"
                    >
                      Make Vendor
                    </button>
                    <button
                      onClick={() => handleRoleChange(u._id, "admin")}
                      disabled={u.role === "admin" || actionLoading === u._id}
                      className="px-2 py-1 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded text-[10px] font-bold transition-colors disabled:opacity-40"
                    >
                      Make Admin
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center">
                    {u.role === "vendor" && u.status !== "fraud" ? (
                      <button
                        onClick={() => handleMarkFraud(u._id)}
                        disabled={actionLoading === u._id}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center space-x-1"
                        title="Mark as Fraud"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-[10px] font-bold">Mark Fraud</span>
                      </button>
                    ) : (
                      <span className="text-(--muted)">-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 10. Admin Advertise View (Table)
function AdminAdvertise({ tickets, loading, actionLoading, setActionLoading, setTickets }) {
  const handleAdvertiseToggle = async (ticketId) => {
    setActionLoading(ticketId);
    try {
      const res = await apiFetch(`/api/tickets/${ticketId}/advertise`, { method: "PUT" });
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, isAdvertised: res.isAdvertised } : t))
      );
    } catch (err) {
      showToast({ message: err.message || "Failed to toggle advertisement.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  // Filter only approved tickets
  const approvedTickets = tickets.filter((t) => t.verificationStatus === "approved");

  if (approvedTickets.length === 0) {
    return <div className="text-center py-12 text-(--muted) text-sm">No approved vendor tickets found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-black text-(--foreground)">Advertise Tickets</h2>
            <p className="text-xs text-(--muted)">Toggle advertisements shown on homepage. (Max 6 tickets)</p>
          </div>
          <span className="px-3 py-1 bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-200 text-xs font-bold rounded-xl">
            Currently Advertised: {approvedTickets.filter((t) => t.isAdvertised).length} / 6
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-(--card-border) bg-(--accent)">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-violet-50 dark:bg-violet-950 text-violet-800 dark:text-violet-200 border-b border-(--card-border)">
              <th className="p-4 font-bold">Ticket Title</th>
              <th className="p-4 font-bold">Route</th>
              <th className="p-4 font-bold">Transport Type</th>
              <th className="p-4 font-bold text-center">Advertise Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--card-border)">
            {approvedTickets.map((t) => (
              <tr key={t._id} className="hover:bg-(--card-bg) text-(--foreground) transition-colors">
                <td className="p-4 font-bold max-w-50 truncate">{t.title}</td>
                <td className="p-4 font-bold">{t.from} → {t.to}</td>
                <td className="p-4 capitalize">{t.transportType}</td>
                <td className="p-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleAdvertiseToggle(t._id)}
                      disabled={actionLoading === t._id}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-wider transition-all shadow-sm ${t.isAdvertised
                          ? "bg-red-100 hover:bg-red-200 text-red-700"
                          : "bg-violet-600 hover:bg-violet-700 text-white"
                        }`}
                    >
                      {actionLoading === t._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : t.isAdvertised ? (
                        "UNADVERTISE"
                      ) : (
                        "ADVERTISE"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
