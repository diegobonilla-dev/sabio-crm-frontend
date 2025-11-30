"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Building2, Settings } from "lucide-react";

const navItems = [
  { href: "/admin", icon: Home, label: "Inicio" },
  { href: "/crm", icon: Users, label: "CRM" },
  { href: "/fincas", icon: Building2, label: "Fincas" },
  { href: "/settings", icon: Settings, label: "Config" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 active:bg-gray-100"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-xs ${isActive ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
