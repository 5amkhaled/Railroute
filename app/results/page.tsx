"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// Sample Indian Railway stations - you can expand this or fetch from API
const STATIONS = [
  "Dimapur",
  "Delhi",
  "Mumbai Central",
  "Bangalore City",
  "Chennai Central",
  "Kolkata",
  "Hyderabad Deccan",
  "Ahmedabad",
  "Pune Junction",
  "Jaipur",
  "Lucknow",
  "Kanpur Central",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Patna Junction",
  "Vadodara",
  "Agra Cantt",
  "Varanasi",
  "Surat",
  "Guwahati",
  "Chandigarh",
  "Trivandrum Central",
  "Coimbatore",
  "Mysore",
  "Visakhapatnam",
  "Bhubaneswar",
  "Ranchi",
  "Gwalior",
  "Jodhpur",
];

export default function Home() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);
  
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fromRef.current &&
        !fromRef.current.contains(event.target as Node) &&
        toRef.current &&
        !toRef.current.contains(event.target as Node)
      ) {
        setActiveInput(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFromChange = (value: string) => {
    setFrom(value);
    if (value.length > 0) {
      const filtered = STATIONS.filter((station) =>
        station.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFromSuggestions(filtered);
      setActiveInput("from");
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (value: string) => {
    setTo(value);
    if (value.length > 0) {
      const filtered = STATIONS.filter((station) =>
        station.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setToSuggestions(filtered);
      setActiveInput("to");
    } else {
      setToSuggestions([]);
    }
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = () => {
    if (!from || !to) return;
    router.push(`/results?from=${from}&to=${to}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🚆 RailRoute
        </h1>
        <p className="text-gray-600 text-sm">Find the best train routes across India</p>
      </div>

      {/* Main Card */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* From Input */}
        <div ref={fromRef} className="relative mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              📍
            </span>
            <input
              type="text"
              placeholder="e.g. Dimapur"
              value={from}
              onChange={(e) => handleFromChange(e.target.value)}
              onFocus={() => setActiveInput("from")}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          
          {/* From Suggestions Dropdown */}
          {activeInput === "from" && fromSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {fromSuggestions.map((station, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFrom(station);
                    setFromSuggestions([]);
                    setActiveInput(null);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-800">{station}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwap}
            className="bg-white border-2 border-gray-200 rounded-full p-2 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
            title="Swap stations"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        {/* To Input */}
        <div ref={toRef} className="relative mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🎯
            </span>
            <input
              type="text"
              placeholder="e.g. Delhi"
              value={to}
              onChange={(e) => handleToChange(e.target.value)}
              onFocus={() => setActiveInput("to")}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          
          {/* To Suggestions Dropdown */}
          {activeInput === "to" && toSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {toSuggestions.map((station, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setTo(station);
                    setToSuggestions([]);
                    setActiveInput(null);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-800">{station}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!from || !to}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
        >
          Find Routes 🔍
        </button>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Press Enter to search • Click ⇅ to swap stations
        </p>
      </div>

      {/* Footer */}
      <p className="text-gray-400 text-xs mt-8">
        Powered by Indian Railways data
      </p>
    </main>
  );
}