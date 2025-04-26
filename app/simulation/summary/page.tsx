"use client"

import { useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSimulation } from "@/context/simulation-context"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { Award, Battery, Clock, Download, Leaf, MapPin, Share2, Shield, AlertTriangle, Bike } from "lucide-react"

export default function SimulationSummaryPage() {
  const { currentTrip } = useSimulation()
  const { addPoints, addBadge, updateChallengeProgress } = useUser()
  const router = useRouter()
  const pointsAwardedRef = useRef(false)

  // Redirect if no trip data
  useEffect(() => {
    if (!currentTrip) {
      router.push("/dashboard")
    }
  }, [currentTrip, router])

  // Award points and badges - only run once when the component mounts
  useEffect(() => {
    if (currentTrip && !pointsAwardedRef.current) {
      // Award points
      addPoints(currentTrip.pointsEarned)

      // Award badges
      currentTrip.badges.forEach((badge) => {
        addBadge(badge)
      })

      // Update challenge progress
      updateChallengeProgress("1", currentTrip.distance) // Green Mile challenge
      if (currentTrip.obstaclesEncountered === 0) {
        updateChallengeProgress("2", 1) // Safe Journey challenge
      }
      if (currentTrip.ecoScore === "A") {
        updateChallengeProgress("3", 1) // Eco Warrior challenge
      }

      // Mark that we've awarded points
      pointsAwardedRef.current = true
    }
  }, [currentTrip, addPoints, addBadge, updateChallengeProgress])

  // Format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    const secs = Math.round((minutes % 1) * 60)

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  if (!currentTrip) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center h-full">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">No Trip Data Available</h1>
            <p className="text-muted-foreground mb-4">Complete a simulation to see your trip summary.</p>
            <Button onClick={() => router.push("/simulation/setup")}>Start New Simulation</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trip Summary</h1>
            <p className="text-muted-foreground">Your simulation results and performance insights</p>
          </div>

          {currentTrip.badges.length > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-800">{currentTrip.badges[0]}</h3>
                    <p className="text-green-700">You achieved an excellent eco-score! Keep up the good work.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Trip Overview</CardTitle>
                <div className="flex items-center gap-2">
                  <Bike className="h-5 w-5" />
                  <span className="font-medium">
                    {currentTrip.route.startLocation} to {currentTrip.route.endLocation}
                  </span>
                </div>
              </div>
              <CardDescription>{currentTrip.startTime && formatDate(currentTrip.startTime)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Total Time
                  </div>
                  <p className="text-2xl font-bold">{formatTime(currentTrip.totalTime)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Distance
                  </div>
                  <p className="text-2xl font-bold">{currentTrip.distance.toFixed(1)} km</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Battery className="h-4 w-4" />
                    Energy Used
                  </div>
                  <p className="text-2xl font-bold">{(currentTrip.distance * 0.05).toFixed(2)} kWh</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    Obstacles
                  </div>
                  <p className="text-2xl font-bold">{currentTrip.obstaclesEncountered}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Route Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-sm font-medium">Start Location:</div>
                    <div>{currentTrip.route.startLocation}</div>

                    <div className="text-sm font-medium">End Location:</div>
                    <div>{currentTrip.route.endLocation}</div>

                    <div className="text-sm font-medium">Checkpoints Passed:</div>
                    <div>
                      {currentTrip.checkpointsPassed} / {currentTrip.totalCheckpoints}
                    </div>

                    <div className="text-sm font-medium">Average Speed:</div>
                    <div>{currentTrip.averageSpeed.toFixed(1)} km/h</div>

                    <div className="text-sm font-medium">Max Speed:</div>
                    <div>{currentTrip.maxSpeed.toFixed(1)} km/h</div>

                    <div className="text-sm font-medium">Battery Consumed:</div>
                    <div>{currentTrip.batteryUsed.toFixed(1)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Tabs defaultValue="eco">
                <TabsList className="w-full">
                  <TabsTrigger value="eco" className="flex-1">
                    Eco Performance
                  </TabsTrigger>
                  <TabsTrigger value="safety" className="flex-1">
                    Safety Report
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="eco">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Eco Score</div>
                            <div
                              className={`
                              text-3xl font-bold w-10 h-10 rounded-full flex items-center justify-center
                              ${
                                currentTrip.ecoScore === "A"
                                  ? "bg-green-100 text-green-700"
                                  : currentTrip.ecoScore === "B"
                                    ? "bg-green-100 text-green-700"
                                    : currentTrip.ecoScore === "C"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : currentTrip.ecoScore === "D"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-red-100 text-red-700"
                              }
                            `}
                            >
                              {currentTrip.ecoScore}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Carbon Saved</div>
                            <div className="text-2xl font-bold">{currentTrip.carbonSaved.toFixed(2)} kg</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Points Earned</div>
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            <span className="text-2xl font-bold">{currentTrip.pointsEarned}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Eco Tip</div>
                          <div className="p-3 bg-green-50 text-green-800 rounded-md text-sm">
                            <div className="flex items-start">
                              <Leaf className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>
                                {currentTrip.ecoScore === "A"
                                  ? "Excellent job! You maintained an optimal speed and efficient driving style."
                                  : "Try maintaining a steady speed between 15-25 km/h for optimal efficiency."}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="safety">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Safety Rating</div>
                            <div
                              className={`
                              text-3xl font-bold w-10 h-10 rounded-full flex items-center justify-center
                              ${
                                currentTrip.obstaclesEncountered === 0
                                  ? "bg-green-100 text-green-700"
                                  : currentTrip.obstaclesEncountered <= 2
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }
                            `}
                            >
                              {currentTrip.obstaclesEncountered === 0
                                ? "A"
                                : currentTrip.obstaclesEncountered <= 2
                                  ? "B"
                                  : "C"}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Obstacles</div>
                            <div className="text-2xl font-bold">{currentTrip.obstaclesEncountered}</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Safety Tip</div>
                          <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                            <div className="flex items-start">
                              <Shield className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>
                                {currentTrip.obstaclesEncountered === 0
                                  ? "Perfect safety record! You successfully avoided all obstacles."
                                  : "Stay alert and maintain a safe distance from obstacles to improve your safety score."}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button className="flex-1" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Results
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => router.push("/simulation/setup")}>Start New Simulation</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
