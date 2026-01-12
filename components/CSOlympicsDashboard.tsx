"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Target, TrendingUp, Plus, X, Download } from "lucide-react";

interface Deal {
  id: number;
  csm: string;
  customer: string;
  type: string;
  medal: string;
  date: string;
}

const CSOlympicsDashboard = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newDeal, setNewDeal] = useState({
    csm: "",
    customer: "",
    type: "",
    medal: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch("/api/deals");
      const data = await response.json();
      setDeals(data);
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const teams = {
    red: [
      "Sofia",
      "Emmanuel",
      "Frida",
      "Wouter",
      "Lucas",
      "Thomas Meulenberg",
      "Robbert",
      "Joeri",
    ],
    blue: [
      "Jeannique",
      "Thomas Alkema",
      "Isabel",
      "Evelyne",
      "Roos",
      "Carlijn",
      "Kayleigh",
    ],
    green: [
      "Marloes",
      "Josephine",
      "Hidde",
      "Stefan",
      "Hubert",
      "Heyden",
      "Naomi",
    ],
  };

  const medalPoints: Record<string, number> = {
    "🥉 Bronze": 1,
    "🥈 Silver": 2,
    "🥇 Gold": 3,
  };

  const dealTypes = {
    bronze: [
      "Additional Language",
      "Lead Forms",
      "Interactive Articles",
      "Brand Visibility",
    ],
    silver: [
      "Starter → Basic",
      "Basic → Pro",
      "Accelerator Package",
      "SEA",
      "Early Renewal",
      "Combo Deal (2 items)",
    ],
    gold: [
      "Starter → Pro",
      "Pro → Enterprise",
      "Additional Domain",
      "Referral",
      "Early Renewal + Upsell",
      "Combo Deal (3+ items)",
    ],
  };

  const getTeamForCSM = (csm: string): string | null => {
    if (teams.red.includes(csm)) return "red";
    if (teams.blue.includes(csm)) return "blue";
    if (teams.green.includes(csm)) return "green";
    return null;
  };

  const calculateTeamPoints = (team: string) => {
    return deals
      .filter((deal) => getTeamForCSM(deal.csm) === team)
      .reduce((sum, deal) => sum + (medalPoints[deal.medal] || 0), 0);
  };

  const calculateIndividualPoints = () => {
    const points: Record<string, number> = {};
    deals.forEach((deal) => {
      points[deal.csm] = (points[deal.csm] || 0) + (medalPoints[deal.medal] || 0);
    });
    return Object.entries(points).sort((a, b) => b[1] - a[1]);
  };

  const teamScores = [
    {
      name: "Red",
      color: "from-red-500 to-red-600",
      points: calculateTeamPoints("red"),
    },
    {
      name: "Blue",
      color: "from-purple-500 to-purple-600",
      points: calculateTeamPoints("blue"),
    },
    {
      name: "Green",
      color: "from-green-500 to-green-600",
      points: calculateTeamPoints("green"),
    },
  ].sort((a, b) => b.points - a.points);

  const totalDeals = deals.length;
  const progressPercent = (totalDeals / 60) * 100;

  const handleAddDeal = async () => {
    if (newDeal.csm && newDeal.customer && newDeal.type && newDeal.medal) {
      const deal = { ...newDeal, id: Date.now() };
      try {
        await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deal),
        });
        setDeals([...deals, deal]);
        setNewDeal({
          csm: "",
          customer: "",
          type: "",
          medal: "",
          date: new Date().toISOString().split("T")[0],
        });
        setShowAddDeal(false);
      } catch (error) {
        console.error("Failed to add deal:", error);
      }
    }
  };

  const handleDeleteDeal = async (id: number) => {
    try {
      await fetch(`/api/deals/${id}`, { method: "DELETE" });
      setDeals(deals.filter((deal) => deal.id !== id));
    } catch (error) {
      console.error("Failed to delete deal:", error);
    }
  };

  const handleExport = () => {
    const headers = ["Date", "CSM", "Customer", "Type", "Medal"];
    const rows = deals.map((d) =>
      [d.date, d.csm, d.customer, d.type, d.medal].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cs-olympics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const RocketLogo = () => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="50" fill="#1a1a1a" />
      <path
        d="M70 30C70 30 65 45 50 60C35 45 30 30 30 30C30 30 35 25 50 25C65 25 70 30 70 30Z"
        fill="#b78af7"
      />
      <circle cx="50" cy="45" r="8" fill="white" />
      <path d="M40 60L35 75L40 70L45 75L50 65" fill="#b78af7" />
      <path d="M60 60L65 75L60 70L55 75L50 65" fill="#b78af7" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      {/* Animated stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse"
          style={{ top: "20%", left: "10%" }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-50 animate-pulse"
          style={{ top: "40%", left: "80%", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30 animate-pulse"
          style={{ top: "60%", left: "30%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-60 animate-pulse"
          style={{ top: "80%", left: "70%", animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse"
          style={{ top: "15%", left: "60%", animationDelay: "0.8s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            <RocketLogo />
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                CS SALES OLYMPICS
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-purple-400 font-bold">WP</span>
                <span className="text-white font-bold">SEO</span>
                <span className="text-purple-400 font-bold">AI</span>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            12 January – 31 March 2025 | 11 Weeks
          </p>
        </div>

        {/* Goal Progress */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-3 rounded-xl shadow-lg shadow-purple-500/30">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{totalDeals} / 60 Deals</h2>
                <p className="text-gray-400 text-sm">Team Goal Progress</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddDeal(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-5 h-5" /> Log Deal
            </button>
          </div>
          <div className="relative w-full bg-gray-800 rounded-full h-8 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 h-full rounded-full transition-all duration-700 flex items-center justify-end px-4 shadow-lg shadow-purple-500/50"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            >
              {progressPercent > 10 && (
                <span className="text-sm font-bold text-white drop-shadow-md">
                  {progressPercent.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Team Standings */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-purple-400" /> Team Standings
            </h2>
            <div className="space-y-4">
              {teamScores.map((team, index) => (
                <div
                  key={team.name}
                  className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold w-12 text-center">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xl">
                          Team {team.name}
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                          {team.points}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                          className={`bg-gradient-to-r ${team.color} h-full rounded-full transition-all duration-700 shadow-lg`}
                          style={{
                            width: `${Math.max(
                              (team.points /
                                Math.max(...teamScores.map((t) => t.points), 1)) *
                                100,
                              5
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Leaderboard */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Medal className="w-6 h-6 text-purple-400" /> Top Performers
            </h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {calculateIndividualPoints()
                .slice(0, 10)
                .map(([csm, points], index) => (
                  <div
                    key={csm}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-500 w-8">
                        #{index + 1}
                      </span>
                      <span className="font-semibold">{csm}</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      {points}
                    </span>
                  </div>
                ))}
              {calculateIndividualPoints().length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                    <RocketLogo />
                  </div>
                  <p className="text-gray-400">
                    No deals logged yet. Launch your first mission! 🚀
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" /> Recent Deals
            </h2>
            <button
              onClick={handleExport}
              disabled={deals.length === 0}
              className="bg-gray-700 hover:bg-gray-600 border border-purple-500/30 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 px-3 text-gray-400 font-semibold">Date</th>
                  <th className="pb-3 px-3 text-gray-400 font-semibold">CSM</th>
                  <th className="pb-3 px-3 text-gray-400 font-semibold">
                    Customer
                  </th>
                  <th className="pb-3 px-3 text-gray-400 font-semibold">Type</th>
                  <th className="pb-3 px-3 text-gray-400 font-semibold">Medal</th>
                  <th className="pb-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {[...deals]
                  .reverse()
                  .slice(0, 10)
                  .map((deal) => (
                    <tr
                      key={deal.id}
                      className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-all"
                    >
                      <td className="py-3 px-3 text-gray-400 text-sm">
                        {deal.date}
                      </td>
                      <td className="py-3 px-3 font-semibold">{deal.csm}</td>
                      <td className="py-3 px-3">{deal.customer}</td>
                      <td className="py-3 px-3 text-sm text-gray-300">
                        {deal.type}
                      </td>
                      <td className="py-3 px-3 text-xl">{deal.medal}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          className="text-red-400 hover:text-red-300 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                {deals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 opacity-30">
                        <RocketLogo />
                      </div>
                      <p className="text-gray-400 text-lg">
                        Ready for liftoff? Start logging deals! 🚀
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddDeal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <div className="w-8 h-8">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="50" fill="#1a1a1a" />
                    <path
                      d="M70 30C70 30 65 45 50 60C35 45 30 30 30 30C30 30 35 25 50 25C65 25 70 30 70 30Z"
                      fill="#b78af7"
                    />
                    <circle cx="50" cy="45" r="8" fill="white" />
                    <path d="M40 60L35 75L40 70L45 75L50 65" fill="#b78af7" />
                    <path d="M60 60L65 75L60 70L55 75L50 65" fill="#b78af7" />
                  </svg>
                </div>
                Log New Deal
              </h3>
              <button
                onClick={() => setShowAddDeal(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  CSM Name
                </label>
                <select
                  value={newDeal.csm}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, csm: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="">Select CSM</option>
                  {[...teams.red, ...teams.blue, ...teams.green]
                    .sort()
                    .map((csm) => (
                      <option key={csm} value={csm}>
                        {csm}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={newDeal.customer}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, customer: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Medal Type
                </label>
                <select
                  value={newDeal.medal}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, medal: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="">Select medal</option>
                  <option value="🥉 Bronze">🥉 Bronze (1 point)</option>
                  <option value="🥈 Silver">🥈 Silver (2 points)</option>
                  <option value="🥇 Gold">🥇 Gold (3 points)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Deal Type
                </label>
                <select
                  value={newDeal.type}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, type: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="">Select deal type</option>
                  <optgroup label="🥉 Bronze">
                    {dealTypes.bronze.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🥈 Silver">
                    {dealTypes.silver.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🥇 Gold">
                    {dealTypes.gold.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  value={newDeal.date}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, date: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddDeal}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
                >
                  Add Deal
                </button>
                <button
                  onClick={() => setShowAddDeal(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSOlympicsDashboard;
