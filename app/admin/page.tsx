"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSimulation } from "@/context/simulation-context"
import { Car, MapPin, Users, Wrench } from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AdminDashboardPage() {
  const { tripHistory } = useSimulation()

  // Mock data for admin dashboard
  const fleetData = [
    { id: 1, name: "Scooter-001", status: "active", battery: 85, lastUsed: "2 hours ago", location: "Downtown" },
    { id: 2, name: "Scooter-002", status: "active", battery: 72, lastUsed: "1 hour ago", location: "Uptown" },
    { id: 3, name: "Scooter-003", status: "maintenance", battery: 45, lastUsed: "1 day ago", location: "Workshop" },
    { id: 4, name: "E-Bike-001", status: "active", battery: 92, lastUsed: "30 minutes ago", location: "Park" },
    {
      id: 5,
      name: "E-Bike-002",
      status: "charging",
      battery: 23,
      lastUsed: "5 hours ago",
      location: "Charging Station",
    },
  ]

  const userData = [
    { id: 1, name: "John Doe", role: "User", trips: 15, points: 1250, lastActive: "2 hours ago" },
    { id: 2, name: "Jane Smith", role: "Admin", trips: 8, points: 780, lastActive: "1 day ago" },
    { id: 3, name: "Bob Johnson", role: "User", trips: 22, points: 1890, lastActive: "3 hours ago" },
    { id: 4, name: "Alice Williams", role: "User", trips: 12, points: 950, lastActive: "Just now" },
    { id: 5, name: "Charlie Brown", role: "Developer", trips: 5, points: 420, lastActive: "2 days ago" },
  ]

  // Usage statistics
  const usageData = [
    { name: "Mon", trips: 12 },
    { name: "Tue", trips: 19 },
    { name: "Wed", trips: 15 },
    { name: "Thu", trips: 22 },
    { name: "Fri", trips: 30 },
    { name: "Sat", trips: 42 },
    { name: "Sun", trips: 35 },
  ]

  // Vehicle type distribution
  const vehicleTypeData = [
    { name: "Scooters", value: 45 },
    { name: "E-Bikes", value: 30 },
    { name: "Delivery Robots", value: 25 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  // Maintenance data
  const maintenanceData = [
    { name: "Scheduled", value: 8 },
    { name: "In Progress", value: 3 },
    { name: "Completed", value: 12 },
  ]

  const MAINTENANCE_COLORS = ["#FF8042", "#FFBB28", "#00C49F"]

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of fleet, users, and simulation data</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">24</div>
                </div>
                <p className="text-xs text-muted-foreground">5 currently in use</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">128</div>
                </div>
                <p className="text-xs text-muted-foreground">12 currently online</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">1,024</div>
                </div>
                <p className="text-xs text-muted-foreground">32 today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Wrench className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">8</div>
                </div>
                <p className="text-xs text-muted-foreground">Vehicles scheduled for maintenance</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="fleet">Fleet</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                    <CardDescription>Daily trips over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="trips" fill="#8884d8" name="Trips" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Distribution</CardTitle>
                    <CardDescription>Distribution by vehicle type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={vehicleTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {vehicleTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fleet">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Status</CardTitle>
                  <CardDescription>Overview of all vehicles in the fleet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-6 gap-4 p-4 font-medium">
                        <div>ID</div>
                        <div>Name</div>
                        <div>Status</div>
                        <div>Battery</div>
                        <div>Last Used</div>
                        <div>Location</div>
                      </div>
                      {fleetData.map((vehicle) => (
                        <div key={vehicle.id} className="grid grid-cols-6 gap-4 border-t p-4">
                          <div className="text-sm">{vehicle.id}</div>
                          <div className="text-sm font-medium">{vehicle.name}</div>
                          <div className="text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                vehicle.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : vehicle.status === "maintenance"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {vehicle.status}
                            </span>
                          </div>
                          <div className="text-sm">{vehicle.battery}%</div>
                          <div className="text-sm">{vehicle.lastUsed}</div>
                          <div className="text-sm">{vehicle.location}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Overview of all users in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-6 gap-4 p-4 font-medium">
                        <div>ID</div>
                        <div>Name</div>
                        <div>Role</div>
                        <div>Trips</div>
                        <div>Points</div>
                        <div>Last Active</div>
                      </div>
                      {userData.map((user) => (
                        <div key={user.id} className="grid grid-cols-6 gap-4 border-t p-4">
                          <div className="text-sm">{user.id}</div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.role === "Admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "Developer"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <div className="text-sm">{user.trips}</div>
                          <div className="text-sm">{user.points}</div>
                          <div className="text-sm">{user.lastActive}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Status</CardTitle>
                    <CardDescription>Overview of maintenance tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={maintenanceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {maintenanceData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={MAINTENANCE_COLORS[index % MAINTENANCE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Maintenance</CardTitle>
                    <CardDescription>Vehicles scheduled for maintenance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md border">
                        <div className="grid grid-cols-4 gap-4 p-4 font-medium">
                          <div>Vehicle</div>
                          <div>Issue</div>
                          <div>Scheduled</div>
                          <div>Priority</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 border-t p-4">
                          <div className="text-sm font-medium">Scooter-003</div>
                          <div className="text-sm">Battery replacement</div>
                          <div className="text-sm">Tomorrow</div>
                          <div className="text-sm">
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              High
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 border-t p-4">
                          <div className="text-sm font-medium">E-Bike-005</div>
                          <div className="text-sm">Brake adjustment</div>
                          <div className="text-sm">In 2 days</div>
                          <div className="text-sm">
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Medium
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 border-t p-4">
                          <div className="text-sm font-medium">Scooter-012</div>
                          <div className="text-sm">Routine inspection</div>
                          <div className="text-sm">Next week</div>
                          <div className="text-sm">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Low
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
