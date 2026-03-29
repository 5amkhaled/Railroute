"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSearch = () => {
    if (!from || !to) return;
    router.push(`/results?from=${from}&to=${to}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🚆 RailRoute</h1>

      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">

        <input
          type="text"
          placeholder="From (e.g. Dimapur)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full p-3 border rounded mb-3"
        />

        <input
          type="text"
          placeholder="To (e.g. Delhi)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold"
        >
          Find Routes
        </button>

      </div>
    </main>
  );
}