"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Users, Car, Wrench, Trophy, Settings, LogOut } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      icon: BarChart3,
      title: "Dashboard",
    },
    {
      href: "/admin/fleet",
      icon: Car,
      title: "Fleet Management",
    },
    {
      href: "/admin/users",
      icon: Users,
      title: "User Management",
    },
    {
      href: "/admin/simulations",
      icon: Car,
      title: "Simulations",
    },
    {
      href: "/admin/maintenance",
      icon: Wrench,
      title: "Maintenance",
    },
    {
      href: "/admin/leaderboard",
      icon: Trophy,
      title: "Leaderboard",
    },
  ]

  return (
    <div className="flex h-screen flex-col border-r bg-background">
      <div className="p-6">
        <Link href="/admin">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">HoverRobotix</h1>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Admin</span>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === route.href && "bg-muted text-primary",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <nav className="grid items-start gap-2 px-2 text-sm font-medium">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Button variant="outline" className="justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </nav>
      </div>
    </div>
  )
}
