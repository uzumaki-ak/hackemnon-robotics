"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSimulation, type RouteInfo } from "@/context/simulation-context"
import { useRouter } from "next/navigation"
import { Bike, Package, MapPin, Navigation } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-setup"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-muted rounded-md">
      <p>Loading map...</p>
    </div>
  ),
})

export default function SimulationSetupPage() {
  const { setupSimulation, startSimulation } = useSimulation()
  const router = useRouter()

  const [vehicleType, setVehicleType] = useState<"scooter" | "ebike" | "delivery-robot">("scooter")
  const [terrain, setTerrain] = useState<"flat" | "uphill" | "bumpy">("flat")
  const [weather, setWeather] = useState<"sunny" | "rainy" | "night">("sunny")
  const [traffic, setTraffic] = useState<"low" | "medium" | "high">("low")
  const [driverName, setDriverName] = useState("")

  // Route information
  const [startLocation, setStartLocation] = useState("Central Park")
  const [endLocation, setEndLocation] = useState("Union Square")
  const [route, setRoute] = useState<RouteInfo | null>(null)

  // Predefined routes for demo
  const predefinedRoutes: Record<string, RouteInfo> = {
    route1: {
      startLocation: "Central Park",
      startCoords: [40.785091, -73.968285],
      endLocation: "Union Square",
      endCoords: [40.7359, -73.9911],
      checkpoints: [
        { id: 1, lat: 40.7731, lng: -73.9712, name: "Columbus Circle", reached: false },
        { id: 2, lat: 40.7589, lng: -73.9851, name: "Times Square", reached: false },
        { id: 3, lat: 40.7484, lng: -73.9857, name: "Herald Square", reached: false },
      ],
      distance: 4.2,
      estimatedTime: 25,
    },
    route2: {
      startLocation: "Brooklyn Bridge",
      startCoords: [40.7061, -73.9969],
      endLocation: "Battery Park",
      endCoords: [40.7033, -74.017],
      checkpoints: [
        { id: 1, lat: 40.7077, lng: -74.0021, name: "City Hall", reached: false },
        { id: 2, lat: 40.7074, lng: -74.0113, name: "World Trade Center", reached: false },
      ],
      distance: 2.1,
      estimatedTime: 15,
    },
    route3: {
      startLocation: "Grand Central",
      startCoords: [40.7527, -73.9772],
      endLocation: "Empire State Building",
      endCoords: [40.7484, -73.9857],
      checkpoints: [{ id: 1, lat: 40.7513, lng: -73.9814, name: "Bryant Park", reached: false }],
      distance: 1.5,
      estimatedTime: 10,
    },
  }

  const handleRouteSelect = (routeId: string) => {
    setRoute(predefinedRoutes[routeId])
    setStartLocation(predefinedRoutes[routeId].startLocation)
    setEndLocation(predefinedRoutes[routeId].endLocation)
  }

  const handleSubmit = () => {
    if (!route) return

    // Setup the simulation first
    setupSimulation({
      vehicleType,
      terrain,
      weather,
      traffic,
      driverName: driverName || "User",
      route,
    })

    // Use a longer delay to ensure setup is complete before starting
    setTimeout(() => {
      startSimulation()
    }, 500)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Simulation Setup</h1>
            <p className="text-muted-foreground">Configure your simulation parameters</p>
          </div>

          <Tabs defaultValue="vehicle" className="space-y-4">
            <TabsList>
              <TabsTrigger value="vehicle">Vehicle Type</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="route">Route Planning</TabsTrigger>
              <TabsTrigger value="driver">Driver Info</TabsTrigger>
            </TabsList>

            <TabsContent value="vehicle" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Select Vehicle Type</CardTitle>
                  <CardDescription>Choose the type of vehicle you want to simulate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <RadioGroup
                    value={vehicleType}
                    onValueChange={(value) => setVehicleType(value as any)}
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                  >
                    <div>
                      <RadioGroupItem value="scooter" id="scooter" className="peer sr-only" />
                      <Label
                        htmlFor="scooter"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Bike className="mb-3 h-6 w-6" />
                        <div className="font-medium">Electric Scooter</div>
                        <div className="text-sm text-muted-foreground">Compact and nimble</div>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem value="ebike" id="ebike" className="peer sr-only" />
                      <Label
                        htmlFor="ebike"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Bike className="mb-3 h-6 w-6" />
                        <div className="font-medium">Electric Bike</div>
                        <div className="text-sm text-muted-foreground">Balanced and versatile</div>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem value="delivery-robot" id="delivery-robot" className="peer sr-only" />
                      <Label
                        htmlFor="delivery-robot"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Package className="mb-3 h-6 w-6" />
                        <div className="font-medium">Delivery Robot</div>
                        <div className="text-sm text-muted-foreground">Autonomous delivery</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conditions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Conditions</CardTitle>
                  <CardDescription>Set the environmental conditions for your simulation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Terrain</Label>
                    <RadioGroup
                      value={terrain}
                      onValueChange={(value) => setTerrain(value as any)}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="flat" id="flat" className="peer sr-only" />
                        <Label
                          htmlFor="flat"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="font-medium">Flat</div>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="uphill" id="uphill" className="peer sr-only" />
                        <Label
                          htmlFor="uphill"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="font-medium">Uphill</div>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="bumpy" id="bumpy" className="peer sr-only" />
                        <Label
                          htmlFor="bumpy"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="font-medium">Bumpy</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Weather</Label>
                    <RadioGroup
                      value={weather}
                      onValueChange={(value) => setWeather(value as any)}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="sunny" id="sunny" className="peer sr-only" />
                        <Label
                          htmlFor="sunny"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="font-medium">Sunny</div>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="rainy" id="rainy" className="peer sr-only" />
                        <Label
                          htmlFor="rainy"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="font-medium">Rainy</div>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="night" id="night" className="peer sr-only" />
                        <Label
                          htmlFor="night"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="font-medium">Night</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Traffic</Label>
                    <RadioGroup
                      value={traffic}
                      onValueChange={(value) => setTraffic(value as any)}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="low" id="low" className="peer sr-only" />
                        <Label
                          htmlFor="low"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="font-medium">Low</div>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                        <Label
                          htmlFor="medium"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="font-medium">Medium</div>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="high" id="high" className="peer sr-only" />
                        <Label
                          htmlFor="high"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="font-medium">High</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="route" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Route Planning</CardTitle>
                  <CardDescription>Select a route for your simulation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button
                      variant={route === predefinedRoutes.route1 ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleRouteSelect("route1")}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Central Park to Union Square
                    </Button>
                    <Button
                      variant={route === predefinedRoutes.route2 ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleRouteSelect("route2")}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Brooklyn Bridge to Battery Park
                    </Button>
                    <Button
                      variant={route === predefinedRoutes.route3 ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleRouteSelect("route3")}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Grand Central to Empire State
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start">Start Location</Label>
                      <Input
                        id="start"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end">End Location</Label>
                      <Input id="end" value={endLocation} onChange={(e) => setEndLocation(e.target.value)} disabled />
                    </div>
                  </div>

                  <div className="h-[400px] rounded-md border">
                    <MapComponent route={route} />
                  </div>

                  {route && (
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Distance</div>
                        <div className="text-2xl">{route.distance} km</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Estimated Time</div>
                        <div className="text-2xl">{route.estimatedTime} min</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Checkpoints</div>
                        <div className="text-2xl">{route.checkpoints.length}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="driver" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Information</CardTitle>
                  <CardDescription>Enter your name for the simulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="name">Driver Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSubmit} disabled={!route} className="w-full">
                    <Navigation className="mr-2 h-4 w-4" />
                    Start Simulation
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
