"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSimulation } from "@/context/simulation-context"
import { Battery, Gauge, Leaf, MapPin, Thermometer } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

export default function PerformancePage() {
  const { tripHistory } = useSimulation()

  // Generate speed data for chart
  const speedData = tripHistory.map((trip, index) => ({
    name: `Trip ${index + 1}`,
    avgSpeed: trip.averageSpeed,
    maxSpeed: trip.maxSpeed,
  }))

  // Generate battery data for chart
  const batteryData = tripHistory.map((trip, index) => ({
    name: `Trip ${index + 1}`,
    batteryUsed: trip.batteryUsed,
  }))

  // Generate distance data for chart
  const distanceData = tripHistory.map((trip, index) => ({
    name: `Trip ${index + 1}`,
    distance: trip.distance,
  }))

  // Generate eco data for chart
  const ecoData = tripHistory.map((trip, index) => {
    const scoreMap = { A: 5, B: 4, C: 3, D: 2, F: 1 }
    return {
      name: `Trip ${index + 1}`,
      ecoScore: scoreMap[trip.ecoScore],
      carbonSaved: trip.carbonSaved,
    }
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
            <p className="text-muted-foreground">Analyze your vehicle's performance metrics</p>
          </div>

          <Tabs defaultValue="speed" className="space-y-4">
            <TabsList>
              <TabsTrigger value="speed">Speed</TabsTrigger>
              <TabsTrigger value="battery">Battery</TabsTrigger>
              <TabsTrigger value="distance">Distance</TabsTrigger>
              <TabsTrigger value="eco">Eco Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="speed">
              <Card>
                <CardHeader>
                  <CardTitle>Speed Analysis</CardTitle>
                  <CardDescription>Average and maximum speed across trips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {speedData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={speedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis unit=" km/h" />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="avgSpeed"
                            name="Average Speed"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                          <Line type="monotone" dataKey="maxSpeed" name="Maximum Speed" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Gauge className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No speed data available</h3>
                        <p className="text-sm text-muted-foreground">Complete trips to see speed analysis</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="battery">
              <Card>
                <CardHeader>
                  <CardTitle>Battery Usage</CardTitle>
                  <CardDescription>Battery consumption across trips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {batteryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={batteryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis unit="%" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="batteryUsed" name="Battery Used" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Battery className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No battery data available</h3>
                        <p className="text-sm text-muted-foreground">Complete trips to see battery usage analysis</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distance">
              <Card>
                <CardHeader>
                  <CardTitle>Distance Traveled</CardTitle>
                  <CardDescription>Distance covered across trips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {distanceData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis unit=" km" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="distance" name="Distance" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No distance data available</h3>
                        <p className="text-sm text-muted-foreground">Complete trips to see distance analysis</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eco">
              <Card>
                <CardHeader>
                  <CardTitle>Eco Performance</CardTitle>
                  <CardDescription>Environmental impact and efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {ecoData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ecoData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" unit=" kg" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="ecoScore"
                            name="Eco Score (1-5)"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="carbonSaved"
                            name="Carbon Saved"
                            stroke="#82ca9d"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No eco data available</h3>
                        <p className="text-sm text-muted-foreground">Complete trips to see eco performance analysis</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Overview of key performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Gauge className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Average Speed</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {tripHistory.length > 0
                      ? (tripHistory.reduce((sum, trip) => sum + trip.averageSpeed, 0) / tripHistory.length).toFixed(1)
                      : "0"}{" "}
                    <span className="text-base font-normal text-muted-foreground">km/h</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Battery className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Avg. Battery Usage</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {tripHistory.length > 0
                      ? (tripHistory.reduce((sum, trip) => sum + trip.batteryUsed, 0) / tripHistory.length).toFixed(1)
                      : "0"}{" "}
                    <span className="text-base font-normal text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Total Distance</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {tripHistory.reduce((sum, trip) => sum + trip.distance, 0).toFixed(1)}{" "}
                    <span className="text-base font-normal text-muted-foreground">km</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Thermometer className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Avg. Motor Temp</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {tripHistory.length > 0
                      ? (tripHistory.reduce((sum, trip) => sum + trip.motorTemp, 0) / tripHistory.length).toFixed(1)
                      : "0"}{" "}
                    <span className="text-base font-normal text-muted-foreground">°C</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
