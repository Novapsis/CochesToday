"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, Tag, Cog, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

// Navigation items
const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Coches",
    icon: Car,
    href: "/admin/cars",
  },
  {
    label: "Marcas y Modelos",
    icon: Tag,
    href: "/admin/brands",
  },
  {
    label: "Configuración",
    icon: Cog,
    href: "/admin/settings",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full flex-col overflow-y-auto bg-card border-r border-accent/20">
        <div className="p-6">
          <Link href="/admin">
            <h1 className="text-xl font-semibold text-foreground">CochesToday Admin</h1>
          </Link>
        </div>
        <div className="flex flex-col w-full">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-foreground/60 text-sm font-medium pl-6 transition-all hover:text-foreground hover:bg-accent/15",
                pathname === route.href
                  ? "text-foreground bg-accent/20 hover:bg-accent/25"
                  : "",
                "h-12"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto p-6">
          <button
            onClick={signOut}
            className="flex items-center gap-x-2 text-foreground/60 text-sm font-medium transition-all hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Mobile Bottom Tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-accent/20 flex justify-around items-center h-16">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center text-foreground/60 text-xs font-medium transition-all",
              pathname === route.href ? "text-accent" : "",
              "py-1 flex-1"
            )}
          >
            <route.icon
              className={cn(
                "h-6 w-6 mb-1",
                pathname === route.href ? "text-accent" : "text-foreground/60"
              )}
            />
            {route.label}
          </Link>
        ))}
      </div>
    </>
  );
};
