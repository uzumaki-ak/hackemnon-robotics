"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSimulation } from "@/context/simulation-context"
import { AlertTriangle, Bell, Shield, Gauge, MapPin, Lock, Phone } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

export default function SafetyPage() {
  const { tripHistory } = useSimulation()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [geofencingEnabled, setGeofencingEnabled] = useState(false)
  const [speedLimitEnabled, setSpeedLimitEnabled] = useState(true)
  const [emergencyContactsEnabled, setEmergencyContactsEnabled] = useState(false)
  const { toast } = useToast()

  const handleTestAlert = () => {
    toast({
      title: "Safety Alert Test",
      description: "This is a test of the safety alert system",
      variant: "destructive",
    })
  }

  // Calculate safety score
  const calculateSafetyScore = () => {
    if (tripHistory.length === 0) return 0

    const totalObstacles = tripHistory.reduce((sum, trip) => sum + trip.obstaclesEncountered, 0)
    const avgObstaclesPerTrip = totalObstacles / tripHistory.length

    // Lower obstacles = higher score
    const baseScore = 100 - avgObstaclesPerTrip * 10
    return Math.max(0, Math.min(100, baseScore))
  }

  const safetyScore = calculateSafetyScore()

  // Get safety grade
  const getSafetyGrade = () => {
    if (safetyScore >= 90) return "A"
    if (safetyScore >= 80) return "B"
    if (safetyScore >= 70) return "C"
    if (safetyScore >= 60) return "D"
    return "F"
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Safety</h1>
            <p className="text-muted-foreground">Manage safety features and settings</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div
                    className={`
                    text-4xl font-bold w-12 h-12 rounded-full flex items-center justify-center mr-4
                    ${
                      getSafetyGrade() === "A"
                        ? "bg-green-100 text-green-700"
                        : getSafetyGrade() === "B"
                          ? "bg-green-100 text-green-700"
                          : getSafetyGrade() === "C"
                            ? "bg-yellow-100 text-yellow-700"
                            : getSafetyGrade() === "D"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                    }
                  `}
                  >
                    {getSafetyGrade()}
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{Math.round(safetyScore)}/100</div>
                    <Progress value={safetyScore} className="h-2 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Obstacles Avoided</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tripHistory.reduce((sum, trip) => sum + trip.obstaclesEncountered, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all simulations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Emergency Stops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Manual emergency stops triggered</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Safe Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tripHistory.filter((trip) => trip.obstaclesEncountered === 0).length}/{tripHistory.length}
                </div>
                <p className="text-xs text-muted-foreground">Trips with no obstacles</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="alerts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
              <TabsTrigger value="features">Safety Features</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Settings</CardTitle>
                  <CardDescription>Configure how you receive safety alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications for safety alerts</p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sound">Sound Alerts</Label>
                        <p className="text-sm text-muted-foreground">Play sound when safety alerts are triggered</p>
                      </div>
                      <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="vibration">Vibration</Label>
                        <p className="text-sm text-muted-foreground">Vibrate device when safety alerts are triggered</p>
                      </div>
                      <Switch id="vibration" checked={vibrationEnabled} onCheckedChange={setVibrationEnabled} />
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-medium">Test Alerts</div>
                        <Button variant="outline" size="sm" onClick={handleTestAlert}>
                          <Bell className="mr-2 h-4 w-4" />
                          Test Alert
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Test the safety alert system to ensure it's working properly
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="font-medium">Alert Types</div>
                      <div className="grid gap-2">
                        <div className="flex items-center p-2 border rounded-md">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 mr-4">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Collision Warning</div>
                            <div className="text-sm text-muted-foreground">
                              Alerts when an obstacle is detected in your path
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center p-2 border rounded-md">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 mr-4">
                            <Gauge className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Speed Warning</div>
                            <div className="text-sm text-muted-foreground">
                              Alerts when you exceed the recommended speed limit
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center p-2 border rounded-md">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-4">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Geofencing Alert</div>
                            <div className="text-sm text-muted-foreground">
                              Alerts when you leave the designated safe area
                            </div>
                          </div>
                          <Switch checked={geofencingEnabled} onCheckedChange={setGeofencingEnabled} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Safety Features</CardTitle>
                  <CardDescription>Configure advanced safety features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="speedLimit">Speed Limiting</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically limit maximum speed based on conditions
                        </p>
                      </div>
                      <Switch id="speedLimit" checked={speedLimitEnabled} onCheckedChange={setSpeedLimitEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="geofencing">Geofencing</Label>
                        <p className="text-sm text-muted-foreground">
                          Restrict vehicle operation to designated safe areas
                        </p>
                      </div>
                      <Switch id="geofencing" checked={geofencingEnabled} onCheckedChange={setGeofencingEnabled} />
                    </div>

                    <div className="space-y-4">
                      <div className="font-medium">Automatic Safety Features</div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-muted">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Obstacle Detection</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm">Status</div>
                              <div className="flex items-center text-green-600">
                                <Shield className="mr-1 h-4 w-4" />
                                Active
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Automatically detects and avoids obstacles in your path
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Auto-Braking</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm">Status</div>
                              <div className="flex items-center text-green-600">
                                <Shield className="mr-1 h-4 w-4" />
                                Active
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Automatically applies brakes in emergency situations
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Stability Control</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm">Status</div>
                              <div className="flex items-center text-green-600">
                                <Shield className="mr-1 h-4 w-4" />
                                Active
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">Maintains stability on uneven terrain</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Fall Detection</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm">Status</div>
                              <div className="flex items-center text-green-600">
                                <Shield className="mr-1 h-4 w-4" />
                                Active
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">Detects if the vehicle has fallen over</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Settings</CardTitle>
                  <CardDescription>Configure emergency response settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emergencyContacts">Emergency Contacts</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically notify emergency contacts in case of an accident
                        </p>
                      </div>
                      <Switch
                        id="emergencyContacts"
                        checked={emergencyContactsEnabled}
                        onCheckedChange={setEmergencyContactsEnabled}
                      />
                    </div>

                    {emergencyContactsEnabled && (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <div className="font-medium">Emergency Contacts</div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input placeholder="Contact Name" defaultValue="Emergency Contact" />
                            <Input placeholder="Phone Number" defaultValue="+1 (555) 123-4567" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Input placeholder="Contact Name" />
                            <Input placeholder="Phone Number" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            Add Contact
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="p-4 border rounded-lg">
                      <div className="font-medium mb-4">Emergency Lock</div>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          Remotely lock your vehicle in case of theft or unauthorized use
                        </div>
                        <Button variant="destructive">
                          <Lock className="mr-2 h-4 w-4" />
                          Emergency Lock
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="font-medium mb-4">Emergency Services</div>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          In case of emergency, you can contact emergency services directly
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline">
                            <Phone className="mr-2 h-4 w-4" />
                            Call Support
                          </Button>
                          <Button variant="destructive">
                            <Phone className="mr-2 h-4 w-4" />
                            Emergency Services
                          </Button>
                        </div>
                      </div>
                    </div>
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
