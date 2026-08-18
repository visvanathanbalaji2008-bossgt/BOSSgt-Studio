import React from "react";
import { User, Settings, Command } from "lucide-react";

export function TopNavigation() {
  const menuItems = ["File", "Edit", "View", "Run", "Terminal", "Help"];

  return (
    <div className="flex items-center justify-between h-12 bg-panel border-b border-panel-border px-4 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-accent font-bold text-base tracking-wide">
          <Command size={18} />
          <span>BOSSgt Studio</span>
        </div>
        
        <nav className="flex items-center gap-1 hidden md:flex">
          {menuItems.map((item) => (
            <button
              key={item}
              className="px-3 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-1.5 text-foreground/70 hover:text-foreground hover:bg-white/10 rounded-md transition-colors">
          <Settings size={16} />
        </button>
        <button className="p-1.5 text-foreground/70 hover:text-foreground hover:bg-white/10 rounded-md transition-colors">
          <User size={16} />
        </button>
      </div>
    </div>
  );
}
