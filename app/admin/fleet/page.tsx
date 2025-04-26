"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Battery, Car, MapPin, Plus, Search, Settings } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for fleet management
const initialFleetData = [
  {
    id: 1,
    name: "Scooter-001",
    type: "scooter",
    status: "active",
    battery: 85,
    lastUsed: "2 hours ago",
    location: "Downtown",
    maintenanceStatus: "ok",
    lastMaintenance: "2023-04-15",
  },
  {
    id: 2,
    name: "Scooter-002",
    type: "scooter",
    status: "active",
    battery: 72,
    lastUsed: "1 hour ago",
    location: "Uptown",
    maintenanceStatus: "ok",
    lastMaintenance: "2023-04-10",
  },
  {
    id: 3,
    name: "Scooter-003",
    type: "scooter",
    status: "maintenance",
    battery: 45,
    lastUsed: "1 day ago",
    location: "Workshop",
    maintenanceStatus: "needs-repair",
    lastMaintenance: "2023-03-22",
  },
  {
    id: 4,
    name: "E-Bike-001",
    type: "ebike",
    status: "active",
    battery: 92,
    lastUsed: "30 minutes ago",
    location: "Park",
    maintenanceStatus: "ok",
    lastMaintenance: "2023-04-18",
  },
  {
    id: 5,
    name: "E-Bike-002",
    type: "ebike",
    status: "charging",
    battery: 23,
    lastUsed: "5 hours ago",
    location: "Charging Station",
    maintenanceStatus: "scheduled",
    lastMaintenance: "2023-03-30",
  },
  {
    id: 6,
    name: "Robot-001",
    type: "delivery-robot",
    status: "active",
    battery: 78,
    lastUsed: "45 minutes ago",
    location: "Shopping District",
    maintenanceStatus: "ok",
    lastMaintenance: "2023-04-05",
  },
  {
    id: 7,
    name: "Robot-002",
    type: "delivery-robot",
    status: "idle",
    battery: 100,
    lastUsed: "2 days ago",
    location: "Storage",
    maintenanceStatus: "ok",
    lastMaintenance: "2023-03-25",
  },
]

export default function FleetManagementPage() {
  const [fleetData, setFleetData] = useState(initialFleetData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const { toast } = useToast()

  // Filter fleet data based on search query and filters
  const filteredFleetData = fleetData.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleAddVehicle = () => {
    toast({
      title: "Feature Not Implemented",
      description: "Adding a new vehicle is not implemented in this demo.",
    })
  }

  const handleDeleteVehicle = (id: number) => {
    setFleetData(fleetData.filter((vehicle) => vehicle.id !== id))
    toast({
      title: "Vehicle Deleted",
      description: "The vehicle has been removed from the fleet.",
    })
  }

  const handleStatusChange = (id: number, status: string) => {
    setFleetData(fleetData.map((vehicle) => (vehicle.id === id ? { ...vehicle, status } : vehicle)))
    toast({
      title: "Status Updated",
      description: `Vehicle status has been updated to ${status}.`,
    })
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
              <p className="text-muted-foreground">Manage and monitor your vehicle fleet</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleAddVehicle}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="charging">Charging</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="scooter">Scooters</SelectItem>
                <SelectItem value="ebike">E-Bikes</SelectItem>
                <SelectItem value="delivery-robot">Delivery Robots</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Inventory</CardTitle>
                  <CardDescription>{filteredFleetData.length} vehicles in the fleet</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Battery</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFleetData.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell>{vehicle.id}</TableCell>
                          <TableCell className="font-medium">{vehicle.name}</TableCell>
                          <TableCell>
                            <span className="capitalize">{vehicle.type.replace("-", " ")}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                vehicle.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : vehicle.status === "maintenance"
                                    ? "bg-red-100 text-red-800"
                                    : vehicle.status === "charging"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {vehicle.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Battery className="mr-2 h-4 w-4 text-muted-foreground" />
                              {vehicle.battery}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                              {vehicle.location}
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.lastUsed}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, "active")}>
                                  Set as Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, "maintenance")}>
                                  Schedule Maintenance
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(vehicle.id, "charging")}>
                                  Send to Charging
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteVehicle(vehicle.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Map</CardTitle>
                  <CardDescription>View the location of all vehicles in the fleet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[500px] bg-muted rounded-md">
                    <div className="text-center">
                      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Map View</h3>
                      <p className="text-sm text-muted-foreground">
                        The map view would display the real-time location of all vehicles.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>View and manage vehicle maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Maintenance</TableHead>
                        <TableHead>Next Scheduled</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFleetData.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">{vehicle.name}</TableCell>
                          <TableCell>
                            <span className="capitalize">{vehicle.type.replace("-", " ")}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                vehicle.maintenanceStatus === "ok"
                                  ? "bg-green-100 text-green-800"
                                  : vehicle.maintenanceStatus === "needs-repair"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {vehicle.maintenanceStatus === "ok"
                                ? "Good"
                                : vehicle.maintenanceStatus === "needs-repair"
                                  ? "Needs Repair"
                                  : "Scheduled"}
                            </span>
                          </TableCell>
                          <TableCell>{vehicle.lastMaintenance}</TableCell>
                          <TableCell>
                            {vehicle.maintenanceStatus === "scheduled"
                              ? "2023-05-15"
                              : vehicle.maintenanceStatus === "needs-repair"
                                ? "ASAP"
                                : "2023-07-15"}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Schedule
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
