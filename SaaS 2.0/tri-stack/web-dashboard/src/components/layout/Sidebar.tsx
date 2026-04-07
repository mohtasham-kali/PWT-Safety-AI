"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, 
  ShieldAlert, 
  Bot, 
  Cpu,
  BarChart2, 
  Settings, 
  User, 
  LogOut, 
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    category: "Overview",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/" },
      { name: "Analytics", icon: BarChart2, href: "/analytics" },
    ]
  },
  {
    category: "Forums",
    items: [
      { name: "Dev Forum", icon: MessageSquare, href: "/forum/dev" },
      { name: "Security Hub", icon: ShieldAlert, href: "/forum/cyber" },
    ]
  },
  {
    category: "AI Automation",
    items: [
      { name: "General Bots", icon: Bot, href: "/bots/general" },
      { name: "Cyber Bots", icon: Cpu, href: "/bots/cyber" },
    ]
  },
  {
    category: "Account",
    items: [
      { name: "Settings", icon: Settings, href: "/settings" },
      { name: "Profile", icon: User, href: "/profile" },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-slate-950/50 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          SaaS 2.0
        </h1>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 space-y-6 pb-6">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
              {section.category}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
