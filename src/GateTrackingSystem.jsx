import React, { useEffect, useState } from "react";
import {
  Car,
  Users,
  Camera,
  BarChart3,
  Clock,
  QrCode
} from "lucide-react";

import CameraScanner from "./scanner/CameraScanner";
import { getVehicles, updateVehicleStatus } from "./services/vehicles";
import { getGuests, updateGuestStatus } from "./services/guests";
import { getLogs, addLog } from "./services/logs";

/* =========================================================
   MAIN APP
========================================================= */
export default function GateTrackingSystem() {
  const [view, setView] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);
  const [guests, setGuests] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setVehicles(await getVehicles());
    setGuests(await getGuests());
    setLogs(await getLogs());
    setLoading(false);
  };

  const handleScan = async (qr) => {
    const vehicle = vehicles.find(v => v.qrCode === qr);
    if (vehicle) {
      const status = vehicle.status === "IN" ? "OUT" : "IN";
      await updateVehicleStatus(vehicle.id, status);
      await addLog({
        type: "vehicle",
        entityId: vehicle.id,
        action: status,
        gateName: "Main Gate",
        timestamp: new Date().toISOString()
      });
      return loadAll();
    }

    const guest = guests.find(g => g.qrCode === qr);
    if (guest) {
      const status = guest.status === "IN" ? "OUT" : "IN";
      await updateGuestStatus(guest.id, status);
      await addLog({
        type: "guest",
        entityId: guest.id,
        action: status,
        gateName: "Main Gate",
        timestamp: new Date().toISOString()
      });
      return loadAll();
    }

    alert("QR Code not recognized");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-400">
        Loading system…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-amber-100">
      <Header view={view} setView={setView} />
      <main className="p-6 max-w-7xl mx-auto">
        {view === "dashboard" && <Dashboard vehicles={vehicles} guests={guests} logs={logs} />}
        {view === "scanner" && <Scanner onScan={handleScan} />}
        {view === "reports" && <Reports logs={logs} vehicles={vehicles} guests={guests} />}
      </main>
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */
function Header({ view, setView }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "scanner", label: "Scanner", icon: Camera },
    { id: "reports", label: "Reports", icon: Clock }
  ];

  return (
    <header className="border-b border-amber-500/20 bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <QrCode className="text-amber-500" />
          <h1 className="font-bold text-xl">GateTrack</h1>
        </div>
        <nav className="flex gap-2">
          {nav.map(n => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === n.id
                  ? "bg-amber-500 text-slate-900"
                  : "hover:bg-slate-800"
              }`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */
function Dashboard({ vehicles, guests, logs }) {
  const vehiclesIn = vehicles.filter(v => v.status === "IN").length;
  const guestsIn = guests.filter(g => g.status === "IN").length;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Stat icon={Car} label="Vehicles Inside" value={vehiclesIn} />
      <Stat icon={Users} label="Guests Inside" value={guestsIn} />
      <Stat icon={Clock} label="Total Logs" value={logs.length} />
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-amber-500/20">
      <Icon className="text-amber-400 mb-2" />
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}

/* =========================================================
   SCANNER
========================================================= */
function Scanner({ onScan }) {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center text-xl font-bold mb-4">
        Scan QR Code
      </h2>
      <CameraScanner onScan={onScan} />
    </div>
  );
}

/* =========================================================
   REPORTS
========================================================= */
function Reports({ logs, vehicles, guests }) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-amber-500/20">
      <h2 className="text-xl font-bold mb-4">Activity Logs</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {logs.map(log => {
          const entity =
            log.type === "vehicle"
              ? vehicles.find(v => v.id === log.entityId)
              : guests.find(g => g.id === log.entityId);

          return (
            <div
              key={log.id}
              className="flex justify-between bg-slate-900 p-3 rounded-lg text-sm"
            >
              <div>
                <strong>{entity ? entity.number || entity.name : "Unknown"}</strong>
                <div className="text-slate-500">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded ${
                  log.action === "IN"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {log.action}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
