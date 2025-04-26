"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useSimulation } from "@/context/simulation-context"
import { Bike, Clock, MapPin, MoreHorizontal, Play, Search, Settings, StopCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/context/user-context"

export default function SimulationControlPage() {
  const { tripHistory } = useSimulation()
  const { users } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateSimulationDialogOpen, setIsCreateSimulationDialogOpen] = useState(false)
  const [activeSimulations, setActiveSimulations] = useState([
    {
      id: 1,
      user: "John Doe",
      vehicleType: "scooter",
      startLocation: "Central Park",
      endLocation: "Union Square",
      startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: "in-progress",
      battery: 78,
      distance: 2.1,
      speed: 18,
    },
    {
      id: 2,
      user: "Jane Smith",
      vehicleType: "ebike",
      startLocation: "Brooklyn Bridge",
      endLocation: "Battery Park",
      startTime: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      status: "in-progress",
      battery: 85,
      distance: 1.2,
      speed: 22,
    },
  ])
  const { toast } = useToast()

  const filteredSimulations = [...activeSimulations, ...tripHistory].filter(
    (sim) =>
      (sim.user || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sim.vehicleType || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sim.startLocation || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sim.endLocation || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sim.status || "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateSimulation = () => {
    const newSimulation = {
      id: activeSimulations.length + 1,
      user: "Bob Johnson",
      vehicleType: "scooter",
      startLocation: "Grand Central",
      endLocation: "Empire State Building",
      startTime: new Date(),
      status: "in-progress",
      battery: 100,
      distance: 0,
      speed: 0,
    }

    setActiveSimulations([...activeSimulations, newSimulation])
    setIsCreateSimulationDialogOpen(false)

    toast({
      title: "Simulation Created",
      description: "New simulation has been started",
    })
  }

  const handleStopSimulation = (id: number) => {
    setActiveSimulations(activeSimulations.filter((sim) => sim.id !== id))

    toast({
      title: "Simulation Stopped",
      description: "The simulation has been stopped",
    })
  }

  const formatDuration = (startTime: Date) => {
    const durationMs = Date.now() - startTime.getTime()
    const minutes = Math.floor(durationMs / (1000 * 60))
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Simulation Control</h1>
              <p className="text-muted-foreground">Monitor and manage active simulations</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search simulations..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsCreateSimulationDialogOpen(true)}>
                <Play className="mr-2 h-4 w-4" />
                Create Simulation
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Simulations</CardTitle>
              <CardDescription>Currently running simulations</CardDescription>
            </CardHeader>
            <CardContent>
              {activeSimulations.length > 0 ? (
                <div className="space-y-4">
                  {activeSimulations.map((simulation) => (
                    <div key={simulation.id} className="flex items-center p-3 border rounded-lg">
                      <div className="mr-4">
                        <Bike className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{simulation.user}</div>
                        <div className="text-sm text-muted-foreground">
                          {simulation.startLocation} to {simulation.endLocation} | {simulation.vehicleType}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {formatDuration(simulation.startTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {simulation.distance.toFixed(1)} km
                        </div>
                        <div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">In Progress</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleStopSimulation(simulation.id)}>
                              <StopCircle className="h-4 w-4 mr-2" />
                              Stop Simulation
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Modify Parameters
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bike className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No active simulations</h3>
                  <p className="text-sm text-muted-foreground mb-4">There are no simulations currently running</p>
                  <Button onClick={() => setIsCreateSimulationDialogOpen(true)}>Create Simulation</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simulation History</CardTitle>
              <CardDescription>Past simulations and their results</CardDescription>
            </CardHeader>
            <CardContent>
              {tripHistory.length > 0 ? (
                <div className="space-y-4">
                  {tripHistory.map((trip, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-lg">
                      <div className="mr-4">
                        <Bike className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          Simulation #{tripHistory.length - index} - {trip.route.startLocation} to{" "}
                          {trip.route.endLocation}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trip.startTime ? trip.startTime.toLocaleString() : "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {Math.floor(trip.totalTime)}m {Math.round((trip.totalTime % 1) * 60)}s
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {trip.distance.toFixed(1)} km
                        </div>
                        <div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No simulation history</h3>
                  <p className="text-sm text-muted-foreground">Completed simulations will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Settings</CardTitle>
                <CardDescription>Default settings for new simulations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Auto-pilot Mode</div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Obstacle Generation</div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Battery Simulation</div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Real-time Monitoring</div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simulation Statistics</CardTitle>
                <CardDescription>Overview of simulation metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Total Simulations</div>
                    <div className="text-2xl font-bold">{tripHistory.length + activeSimulations.length}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Active Simulations</div>
                    <div className="text-2xl font-bold">{activeSimulations.length}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Avg. Duration</div>
                    <div className="text-2xl font-bold">
                      {tripHistory.length > 0
                        ? `${Math.floor(
                            tripHistory.reduce((sum, trip) => sum + trip.totalTime, 0) / tripHistory.length,
                          )}m`
                        : "0m"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Avg. Distance</div>
                    <div className="text-2xl font-bold">
                      {tripHistory.length > 0
                        ? `${(tripHistory.reduce((sum, trip) => sum + trip.distance, 0) / tripHistory.length).toFixed(
                            1,
                          )} km`
                        : "0 km"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isCreateSimulationDialogOpen} onOpenChange={setIsCreateSimulationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Simulation</DialogTitle>
            <DialogDescription>Set up a new simulation for a user</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select defaultValue="user-3">
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={`user-${user.id}`}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Vehicle Type</Label>
              <Select defaultValue="scooter">
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scooter">Scooter</SelectItem>
                  <SelectItem value="ebike">E-Bike</SelectItem>
                  <SelectItem value="delivery-robot">Delivery Robot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-location">Start Location</Label>
                <Select defaultValue="central-park">
                  <SelectTrigger>
                    <SelectValue placeholder="Select start location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central-park">Central Park</SelectItem>
                    <SelectItem value="grand-central">Grand Central</SelectItem>
                    <SelectItem value="brooklyn-bridge">Brooklyn Bridge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-location">End Location</Label>
                <Select defaultValue="empire-state">
                  <SelectTrigger>
                    <SelectValue placeholder="Select end location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empire-state">Empire State Building</SelectItem>
                    <SelectItem value="union-square">Union Square</SelectItem>
                    <SelectItem value="battery-park">Battery Park</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-pilot">Auto-pilot Mode</Label>
                <Switch id="auto-pilot" defaultChecked />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateSimulationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSimulation}>Create Simulation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
