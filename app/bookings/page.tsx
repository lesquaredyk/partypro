"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Booking = {
  id: number;
  name: string;
  date: string;
  eventType: string;
  package: string;
  phone: string;
  email: string;
  notes: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

// ✅ ADDED: status validator
const VALID_STATUS = ["Pending", "Confirmed", "Completed", "Cancelled"] as const;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<
    "All" | "Pending" | "Confirmed" | "Completed" | "Cancelled"
  >("All");

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("partypro_bookings") || "[]");

    // ✅ ADDED: normalize status
    const normalized = stored.map((b: any) => ({
      ...b,
      status: VALID_STATUS.includes(b.status) ? b.status : "Pending",
    }));

    setBookings(normalized);
    localStorage.setItem("partypro_bookings", JSON.stringify(normalized));
  }, []);

  const updateStatus = (id: number, newStatus: Booking["status"]) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: newStatus } : b
    );

    setBookings(updated);
    localStorage.setItem("partypro_bookings", JSON.stringify(updated));
  };

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  return (
    <div className="min-h-screen flex bg-[#f5f6f8]">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#5f6ee7] to-[#d786e8] text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 border-b border-white/20 px-5 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
              🎉
            </div>
            <div>
              <h1 className="font-bold">PartyPro</h1>
              <p className="text-sm text-white/80">Admin Dashboard</p>
            </div>
          </div>

          <nav className="mt-4 space-y-2 px-3">
            <Link href="/admin" className="block rounded-xl px-4 py-3 text-white/90 hover:bg-white/10">
              Dashboard
            </Link>

            <Link href="/inventory" className="block rounded-xl px-4 py-3 text-white/90 hover:bg-white/10">
              Inventory
            </Link>

            <Link
              href="/bookings"
              className="block rounded-xl px-4 py-3 bg-white/20 font-medium"
            >
              Bookings
            </Link>

            <div className="rounded-xl px-4 py-3 text-white/90">Calendar</div>

            <Link
              href="/pos"
              className="block rounded-xl px-4 py-3 text-white/90 hover:bg-white/10"
            >
              POS / Sales
            </Link>

            <div className="rounded-xl px-4 py-3 text-white/90">Forecasting</div>
          </nav>
        </div>

        <div className="border-t border-white/20 px-5 py-5 text-white/90">
          Exit Admin
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1f2a44]">
            Booking Management
          </h1>
          <p className="text-gray-500">
            View and manage customer bookings
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-3 mb-6">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-4 py-2 rounded-full text-sm
                  ${
                    filter === tab
                      ? "bg-purple-500 text-white"
                      : "bg-white text-gray-600"
                  }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* LIST */}
        <div className="rounded-2xl bg-white p-6 shadow-sm min-h-[200px] flex items-center justify-center">
          {filteredBookings.length === 0 ? (
            <p className="text-xs text-gray-600 font-medium">
              No bookings yet
            </p>
          ) : (
            <div className="w-full space-y-3">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between items-center border p-4 rounded-xl"
                >
                  
                  {/* LEFT SIDE */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[#1f2a44]">{b.name}</p>

                      {/* ✅ STATUS BADGE (ADDED STYLE) */}
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium
                          ${b.status === "Pending" && "bg-yellow-100 text-yellow-700"}
                          ${b.status === "Confirmed" && "bg-green-100 text-green-700"}
                          ${b.status === "Completed" && "bg-blue-100 text-blue-700"}
                          ${b.status === "Cancelled" && "bg-red-100 text-red-700"}
                        `}
                      >
                        {b.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">{b.date}</p>
                    <p className="text-xs text-gray-400">
                      {b.package} • {b.eventType}
                    </p>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-2">

                    {/* PENDING */}
                    {b.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(b.id, "Confirmed")}
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded-md"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, "Cancelled")}
                          className="text-xs bg-red-400 text-white px-3 py-1 rounded-md"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {/* CONFIRMED */}
                    {b.status === "Confirmed" && (
                      <button
                        onClick={() => updateStatus(b.id, "Completed")}
                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded-md"
                      >
                        Complete
                      </button>
                    )}

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}