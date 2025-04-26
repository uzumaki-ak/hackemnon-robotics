"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useSimulation } from "@/context/simulation-context"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Battery,
  Gauge,
  MapPin,
  Thermometer,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Leaf,
  Shield,
} from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-simulation"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-muted rounded-md">
      <p>Loading map...</p>
    </div>
  ),
})

export default function SimulationDashboardPage() {
  const {
    isSimulationRunning,
    isSimulationPaused,
    isAutoPilot,
    settings,
    metrics,
    currentPosition,
    targetSpeed,
    setTargetSpeed,
    toggleAutoPilot,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    emergencyStop,
  } = useSimulation()

  const router = useRouter()

  // Redirect if simulation is not running
  useEffect(() => {
    if (!isSimulationRunning && !isSimulationPaused) {
      router.push("/simulation/setup")
    }
  }, [isSimulationRunning, isSimulationPaused, router])

  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(metrics.timeRemaining)
    const seconds = Math.round((metrics.timeRemaining - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")} min`
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Simulation</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>
                  {settings.vehicleType === "scooter"
                    ? "Scooter"
                    : settings.vehicleType === "ebike"
                      ? "E-Bike"
                      : "Delivery Robot"}
                </span>
                <span>•</span>
                <span>{settings.terrain} terrain</span>
                <span>•</span>
                <span>{settings.weather}</span>
                <span>•</span>
                <span>{settings.traffic} traffic</span>
              </div>
            </div>
            <Button variant="destructive" onClick={emergencyStop}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Exit Simulation
            </Button>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="eco">Eco</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <MapPin className="mr-2 h-5 w-5" />
                      Route Navigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] rounded-md overflow-hidden">
                      <MapComponent route={settings.route} currentPosition={currentPosition} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Time Remaining</div>
                        <div className="text-xl">{formatTimeRemaining()}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Battery Used</div>
                        <div className="text-xl">{metrics.batteryUsed.toFixed(0)}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Next Checkpoint</div>
                        <div className="text-xl">
                          {metrics.checkpointsPassed} / {metrics.totalCheckpoints}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <Gauge className="mr-2 h-5 w-5" />
                        Speed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold mb-2">
                        {metrics.speed.toFixed(1)}{" "}
                        <span className="text-lg font-normal text-muted-foreground">km/h</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">Max: 45 km/h</div>
                      <Progress value={(metrics.speed / 45) * 100} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <Battery className="mr-2 h-5 w-5" />
                        Battery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold mb-2">
                        {metrics.battery.toFixed(0)}{" "}
                        <span className="text-lg font-normal text-muted-foreground">%</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Range: {metrics.estimatedRange.toFixed(1)} km
                      </div>
                      <Progress value={metrics.battery} className="h-2" />
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                          <MapPin className="mr-2 h-5 w-5" />
                          Distance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {metrics.distance.toFixed(1)}{" "}
                          <span className="text-base font-normal text-muted-foreground">km</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                          <Thermometer className="mr-2 h-5 w-5" />
                          Motor Temp
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {metrics.motorTemp.toFixed(0)}{" "}
                          <span className="text-base font-normal text-muted-foreground">°C</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Settings className="mr-2 h-5 w-5" />
                    Simulation Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Target Speed ({targetSpeed} km/h)</Label>
                        <div className="text-sm text-muted-foreground">Max: 45 km/h</div>
                      </div>
                      <Slider
                        value={[targetSpeed]}
                        onValueChange={(value) => setTargetSpeed(value[0])}
                        max={45}
                        step={1}
                        disabled={isAutoPilot}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="autopilot" checked={isAutoPilot} onCheckedChange={toggleAutoPilot} />
                      <Label htmlFor="autopilot">Auto-Pilot Mode</Label>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {isSimulationPaused ? (
                        <Button onClick={resumeSimulation}>
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      ) : (
                        <Button onClick={pauseSimulation}>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </Button>
                      )}
                      <Button variant="outline" onClick={resetSimulation}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                      <Button variant="destructive" onClick={emergencyStop}>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Emergency Stop
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Safety Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="bg-muted">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Obstacle Detection</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">Status</div>
                              <div className="flex items-center text-green-500">
                                <Shield className="mr-1 h-4 w-4" />
                                Active
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium">Obstacles Encountered</div>
                              <div className="text-2xl">{metrics.obstaclesEncountered}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              The system will automatically detect obstacles and slow down the vehicle.
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Emergency Controls</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="destructive" className="w-full" onClick={emergencyStop}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Emergency Stop
                              </Button>
                              <Button variant="outline" className="w-full" onClick={() => setTargetSpeed(0)}>
                                <Gauge className="mr-2 h-4 w-4" />
                                Zero Speed
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Use these controls in case of emergency to immediately stop the vehicle.
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-muted">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Vehicle Locking</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch id="lock" />
                            <Label htmlFor="lock">Lock Vehicle</Label>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            When locked, the vehicle cannot be operated until unlocked.
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Safety Alerts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {metrics.battery < 20 && (
                            <div className="flex items-center p-3 bg-amber-100 text-amber-800 rounded-md">
                              <Battery className="mr-2 h-5 w-5" />
                              <div>
                                <div className="font-medium">Low Battery Warning</div>
                                <div className="text-sm">Battery level is below 20%. Consider charging soon.</div>
                              </div>
                            </div>
                          )}

                          {metrics.motorTemp > 60 && (
                            <div className="flex items-center p-3 bg-red-100 text-red-800 rounded-md">
                              <Thermometer className="mr-2 h-5 w-5" />
                              <div>
                                <div className="font-medium">High Temperature Alert</div>
                                <div className="text-sm">
                                  Motor temperature is above normal. Reduce speed to cool down.
                                </div>
                              </div>
                            </div>
                          )}

                          {metrics.speed > 35 && (
                            <div className="flex items-center p-3 bg-amber-100 text-amber-800 rounded-md">
                              <Gauge className="mr-2 h-5 w-5" />
                              <div>
                                <div className="font-medium">Speed Warning</div>
                                <div className="text-sm">You are exceeding the recommended speed limit.</div>
                              </div>
                            </div>
                          )}

                          {metrics.battery >= 20 && metrics.motorTemp <= 60 && metrics.speed <= 35 && (
                            <div className="flex items-center p-3 bg-green-100 text-green-800 rounded-md">
                              <Shield className="mr-2 h-5 w-5" />
                              <div>
                                <div className="font-medium">All Systems Normal</div>
                                <div className="text-sm">No safety alerts at this time.</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eco" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Eco-Friendly Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="bg-muted">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Carbon Savings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-3xl font-bold">
                              {metrics.carbonSaved.toFixed(2)}{" "}
                              <span className="text-lg font-normal text-muted-foreground">kg CO₂</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Amount of carbon emissions saved compared to a gas-powered vehicle.
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Eco Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <div
                                className={`
                                text-4xl font-bold w-12 h-12 rounded-full flex items-center justify-center
                                ${
                                  metrics.ecoScore === "A"
                                    ? "bg-green-100 text-green-700"
                                    : metrics.ecoScore === "B"
                                      ? "bg-green-100 text-green-700"
                                      : metrics.ecoScore === "C"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : metrics.ecoScore === "D"
                                          ? "bg-orange-100 text-orange-700"
                                          : "bg-red-100 text-red-700"
                                }
                              `}
                              >
                                {metrics.ecoScore}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium">
                                  {metrics.ecoScore === "A"
                                    ? "Excellent"
                                    : metrics.ecoScore === "B"
                                      ? "Good"
                                      : metrics.ecoScore === "C"
                                        ? "Average"
                                        : metrics.ecoScore === "D"
                                          ? "Below Average"
                                          : "Poor"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Based on driving style and energy usage
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-muted">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Eco Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 rounded-md">
                            <div className="font-medium text-green-800 mb-2">AI-Generated Eco Tips</div>
                            <ul className="space-y-2 text-sm text-green-700">
                              <li className="flex items-start">
                                <Leaf className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Maintain a steady speed to optimize battery usage and extend range.</span>
                              </li>
                              <li className="flex items-start">
                                <Leaf className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Avoid rapid acceleration and harsh braking to improve energy efficiency.</span>
                              </li>
                              <li className="flex items-start">
                                <Leaf className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>
                                  Plan routes with fewer hills and traffic lights to minimize energy consumption.
                                </span>
                              </li>
                              {metrics.speed > 30 && (
                                <li className="flex items-start">
                                  <Leaf className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Reducing your speed by 5-10 km/h could significantly improve your eco score.
                                  </span>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Smart Route</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-sm text-muted-foreground mb-2">
                            Optimize your route to minimize energy consumption
                          </div>
                          <Button className="w-full">
                            <Leaf className="mr-2 h-4 w-4" />
                            Find Eco-Friendly Route
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
