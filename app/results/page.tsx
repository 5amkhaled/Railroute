"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResultsContent() {
  const params = useSearchParams();

  const from = params.get("from");
  const to = params.get("to");

  const routes = [
    {
      from,
      to,
      train: "15906 Dibrugarh - Chandigarh Express",
      duration: "50h 45m",
    },
    {
      from,
      to,
      train: "12424 Rajdhani Express",
      duration: "28h",
    },
  ];

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-2">Routes</h1>
      <p className="text-gray-600 mb-6">
        {from} → {to}
      </p>

      <div className="flex flex-col gap-4">
        {routes.map((route, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{route.train}</p>
            <p className="text-sm text-gray-600">
              {route.from} → {route.to}
            </p>
            <p className="text-sm text-gray-500">
              Duration: {route.duration}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResultsContent />
    </Suspense>
  );
}