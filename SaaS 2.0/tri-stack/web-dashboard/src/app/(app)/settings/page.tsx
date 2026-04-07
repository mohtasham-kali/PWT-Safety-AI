"use client";

import { Monitor, Bell, BrainCircuit } from "lucide-react";
import { useSettings } from "@/providers/SettingsProvider";

export default function SettingsPage() {
  const { chartType, setChartType } = useSettings();

  return (
    <div className="max-w-3xl border border-white/5 rounded-2xl bg-slate-900/50 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-slate-400">Configure your AI models, notifications, and analytics preferences.</p>
      </div>

      {/* AI Model Selection */}
      <section className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          AI Model Selection
        </h3>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Default Chat Model</label>
            <select className="bg-slate-950 border border-white/10 rounded-lg p-3 text-slate-200 outline-none focus:border-purple-500/50">
              <option>GPT-4 Turbo (Recommended)</option>
              <option>Claude 3 Opus</option>
              <option>Llama 3 70B</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Code Assistant Model</label>
            <select className="bg-slate-950 border border-white/10 rounded-lg p-3 text-slate-200 outline-none focus:border-purple-500/50">
              <option>StarCoder2 15B</option>
              <option>CodeLlama 70B</option>
            </select>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4 pt-8 border-t border-white/5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          Notifications & Alerts
        </h3>
        <div className="space-y-3">
          {["Email Alerts for Security Issues", "Push Notifications for Bot Completion", "Weekly Analytics Summary"].map((label, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="peer sr-only" defaultChecked={i === 0} />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500/50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </div>
              <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Analytics Preferences */}
      <section className="space-y-4 pt-8 border-t border-white/5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Monitor className="w-5 h-5 text-emerald-400" />
          Analytics Display
        </h3>
        <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Default Chart Type</label>
            <select 
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="bg-slate-950 border border-white/10 rounded-lg p-3 text-slate-200 outline-none focus:border-emerald-500/50"
            >
              <option value="pie">Pie Chart (Distribution)</option>
              <option value="bar">Bar Chart (Comparison)</option>
              <option value="line">Line Chart (Trend)</option>
            </select>
          </div>
      </section>

      <div className="pt-8 w-full flex justify-end">
        <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-purple-500/25">
          Save Changes
        </button>
      </div>
    </div>
  );
}
