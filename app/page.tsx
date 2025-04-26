import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Bike, Package, ChevronRight, Award } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">HoverRobotix</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Simulate Your Electric Vehicle Experience
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Test drive personal EVs and delivery robots in a virtual environment. No hardware required.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/simulation/setup">
                  <Button size="lg" className="gap-2">
                    Start Simulation <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" size="lg">
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Bike className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Personal EV Simulation</CardTitle>
                  <CardDescription>Simulate e-bikes, scooters, and other personal electric vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Realistic battery drain simulation</li>
                    <li>Route planning with checkpoints</li>
                    <li>Performance monitoring</li>
                    <li>Safety features</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Package className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Delivery Robot Simulation</CardTitle>
                  <CardDescription>Test autonomous delivery robots in various conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Multiple delivery route planning</li>
                    <li>Obstacle detection and avoidance</li>
                    <li>Battery optimization</li>
                    <li>Fleet management</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Gamification & Insights</CardTitle>
                  <CardDescription>Earn rewards and gain valuable insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Eco-friendly insights</li>
                    <li>Badges and achievements</li>
                    <li>Leaderboard competition</li>
                    <li>AI-powered trip analysis</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 HoverRobotix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
