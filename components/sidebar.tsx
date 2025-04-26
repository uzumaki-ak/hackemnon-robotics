"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Bike,
  BarChart3,
  Settings,
  Shield,
  Award,
  Users,
  Truck,
  Menu,
  Home,
  Lock,
  PenToolIcon as Tool,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isAdmin?: boolean
}

export function Sidebar({ className, isAdmin = false, ...props }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = isAdmin
    ? [
        {
          name: "Dashboard",
          href: "/admin",
          icon: Home,
        },
        {
          name: "Fleet Monitoring",
          href: "/admin/fleet",
          icon: Truck,
        },
        {
          name: "User Management",
          href: "/admin/users",
          icon: Users,
        },
        {
          name: "Simulation Control",
          href: "/admin/simulations",
          icon: Settings,
        },
        {
          name: "Maintenance",
          href: "/admin/maintenance",
          icon: Tool,
        },
        {
          name: "Leaderboard",
          href: "/admin/leaderboard",
          icon: Trophy,
        },
      ]
    : [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: Home,
        },
        {
          name: "Simulation",
          href: "/simulation/setup",
          icon: Bike,
        },
        {
          name: "Performance",
          href: "/performance",
          icon: BarChart3,
        },
        {
          name: "Safety",
          href: "/safety",
          icon: Shield,
        },
        {
          name: "Gamification",
          href: "/gamification",
          icon: Award,
        },
        {
          name: "Leaderboard",
          href: "/leaderboard",
          icon: Trophy,
        },
        {
          name: "Vehicle Lock",
          href: "/lock",
          icon: Lock,
        },
        {
          name: "Maintenance",
          href: "/maintenance",
          icon: Tool,
        },
      ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Bike className="h-6 w-6" />
                <h2 className="text-lg font-semibold">HoverRobotix</h2>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4">
                <nav className="grid gap-2">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === route.href || pathname.startsWith(`${route.href}/`)
                          ? "bg-accent text-accent-foreground"
                          : "transparent",
                      )}
                    >
                      <route.icon className="h-4 w-4" />
                      {route.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
      <div className={cn("hidden md:flex flex-col h-screen border-r", className)} {...props}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Bike className="h-6 w-6" />
            <h2 className="text-lg font-semibold">HoverRobotix</h2>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <nav className="grid gap-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === route.href || pathname.startsWith(`${route.href}/`)
                      ? "bg-accent text-accent-foreground"
                      : "transparent",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.name}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
