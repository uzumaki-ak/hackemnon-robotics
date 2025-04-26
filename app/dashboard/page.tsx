"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSimulation } from "@/context/simulation-context"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import {
  Bike,
  BarChart3,
  Award,
  Trophy,
  Lock,
  PenToolIcon as Tool,
  Battery,
  MapPin,
  Clock,
  AlertTriangle,
  Leaf,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function DashboardPage() {
  const { tripHistory } = useSimulation()
  const { currentUser, challenges } = useUser()
  const router = useRouter()

  // Calculate stats
  const totalTrips = tripHistory.length
  const totalDistance = tripHistory.reduce((sum, trip) => sum + trip.distance, 0).toFixed(1)
  const totalCarbonSaved = tripHistory.reduce((sum, trip) => sum + trip.carbonSaved, 0).toFixed(2)
  const averageEcoScore =
    tripHistory.length > 0
      ? tripHistory.reduce((sum, trip) => {
          const scoreMap = { A: 5, B: 4, C: 3, D: 2, F: 1 }
          return sum + scoreMap[trip.ecoScore]
        }, 0) / tripHistory.length
      : 0

  const latestTrip = tripHistory.length > 0 ? tripHistory[tripHistory.length - 1] : null

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {currentUser?.name || "User"}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                <Bike className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTrips}</div>
                <p className="text-xs text-muted-foreground">Lifetime simulations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDistance} km</div>
                <p className="text-xs text-muted-foreground">Across all simulations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCarbonSaved} kg</div>
                <p className="text-xs text-muted-foreground">CO₂ emissions prevented</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Green Points</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentUser?.points || 0}</div>
                <p className="text-xs text-muted-foreground">Your current score</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Latest Trip</CardTitle>
                <CardDescription>
                  {latestTrip
                    ? `${latestTrip.route.startLocation} to ${latestTrip.route.endLocation}`
                    : "No trips recorded yet"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {latestTrip ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Duration
                        </div>
                        <p className="text-xl font-medium">
                          {Math.floor(latestTrip.totalTime)}m {Math.round((latestTrip.totalTime % 1) * 60)}s
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          Distance
                        </div>
                        <p className="text-xl font-medium">{latestTrip.distance.toFixed(1)} km</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Battery className="h-4 w-4" />
                          Battery Used
                        </div>
                        <p className="text-xl font-medium">{latestTrip.batteryUsed.toFixed(0)}%</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4" />
                          Obstacles
                        </div>
                        <p className="text-xl font-medium">{latestTrip.obstaclesEncountered}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link href="/simulation/summary">
                        <Button variant="outline">View Full Summary</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bike className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No trips yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Start a simulation to see your trip data here</p>
                    <Button onClick={() => router.push("/simulation/setup")}>Start Simulation</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Daily Challenges</CardTitle>
                <CardDescription>Complete challenges to earn points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{challenge.title}</div>
                        <div className="text-sm text-muted-foreground">{challenge.points} pts</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{challenge.description}</div>
                      <div className="flex items-center gap-2">
                        <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {challenge.progress}/{challenge.target}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start" onClick={() => router.push("/simulation/setup")}>
                    <Bike className="mr-2 h-4 w-4" />
                    New Simulation
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => router.push("/performance")}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Performance
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => router.push("/gamification")}>
                    <Award className="mr-2 h-4 w-4" />
                    Gamification
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => router.push("/leaderboard")}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => router.push("/lock")}>
                    <Lock className="mr-2 h-4 w-4" />
                    Vehicle Lock
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => router.push("/maintenance")}>
                    <Tool className="mr-2 h-4 w-4" />
                    Maintenance
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Badges</CardTitle>
                <CardDescription>Achievements you've earned</CardDescription>
              </CardHeader>
              <CardContent>
                {currentUser?.badges && currentUser.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.badges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                        <Award className="h-4 w-4 text-primary" />
                        {badge}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Complete simulations to earn badges</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
