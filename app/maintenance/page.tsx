"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  Battery,
  Calendar,
  CheckCircle,
  Clock,
  History,
  Settings,
  Wrench,
  X,
  PenToolIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MaintenancePage() {
  const [batteryHealth, setBatteryHealth] = useState(85)
  const [motorHealth, setMotorHealth] = useState(92)
  const [tiresHealth, setTiresHealth] = useState(78)
  const [brakesHealth, setBrakesHealth] = useState(90)
  const [scheduledMaintenance, setScheduledMaintenance] = useState([
    {
      id: 1,
      type: "Battery Check",
      date: "2025-05-15",
      time: "10:00 AM",
      status: "scheduled",
    },
    {
      id: 2,
      type: "Tire Replacement",
      date: "2025-05-20",
      time: "2:00 PM",
      status: "scheduled",
    },
  ])
  const [maintenanceHistory, setMaintenanceHistory] = useState([
    {
      id: 1,
      type: "Motor Inspection",
      date: "2025-04-10",
      technician: "John Smith",
      notes: "Motor in good condition, minor adjustments made",
    },
    {
      id: 2,
      type: "Battery Replacement",
      date: "2025-03-15",
      technician: "Sarah Johnson",
      notes: "Replaced battery with new model, improved capacity",
    },
  ])
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleScheduleMaintenance = () => {
    setScheduledMaintenance([
      ...scheduledMaintenance,
      {
        id: scheduledMaintenance.length + 3,
        type: "General Inspection",
        date: "2025-06-01",
        time: "11:00 AM",
        status: "scheduled",
      },
    ])

    setIsScheduleDialogOpen(false)

    toast({
      title: "Maintenance Scheduled",
      description: "Your maintenance has been scheduled for June 1, 2025 at 11:00 AM",
    })
  }

  const handleCancelMaintenance = (id: number) => {
    setScheduledMaintenance(scheduledMaintenance.filter((item) => item.id !== id))

    toast({
      title: "Maintenance Cancelled",
      description: "Your scheduled maintenance has been cancelled",
    })
  }

  const handleRescheduleMaintenance = (id: number) => {
    setScheduledMaintenance(
      scheduledMaintenance.map((item) =>
        item.id === id
          ? {
              ...item,
              date: "2025-06-05",
              time: "3:00 PM",
            }
          : item,
      ),
    )

    toast({
      title: "Maintenance Rescheduled",
      description: "Your maintenance has been rescheduled for June 5, 2025 at 3:00 PM",
    })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
            <p className="text-muted-foreground">Monitor and manage your vehicle's maintenance</p>
          </div>

          <Tabs defaultValue="status" className="space-y-4">
            <TabsList>
              <TabsTrigger value="status">Component Status</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Maintenance</TabsTrigger>
              <TabsTrigger value="history">Maintenance History</TabsTrigger>
              <TabsTrigger value="predictive">Predictive Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>Component Health</CardTitle>
                  <CardDescription>Current status of your vehicle's components</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Battery className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="font-medium">Battery Health</span>
                        </div>
                        <span className="text-sm font-medium">{batteryHealth}%</span>
                      </div>
                      <Progress value={batteryHealth} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {batteryHealth > 80
                          ? "Good condition. No action needed."
                          : batteryHealth > 60
                            ? "Fair condition. Consider checking in the next few months."
                            : "Poor condition. Replacement recommended."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Settings className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="font-medium">Motor Health</span>
                        </div>
                        <span className="text-sm font-medium">{motorHealth}%</span>
                      </div>
                      <Progress value={motorHealth} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {motorHealth > 80
                          ? "Excellent condition. No action needed."
                          : motorHealth > 60
                            ? "Good condition. Regular maintenance recommended."
                            : "Fair condition. Inspection recommended."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <PenToolIcon className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="font-medium">Tires Health</span>
                        </div>
                        <span className="text-sm font-medium">{tiresHealth}%</span>
                      </div>
                      <Progress value={tiresHealth} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {tiresHealth > 80
                          ? "Good condition. No action needed."
                          : tiresHealth > 60
                            ? "Fair condition. Monitor tread depth."
                            : "Poor condition. Replacement recommended."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <PenToolIcon className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="font-medium">Brakes Health</span>
                        </div>
                        <span className="text-sm font-medium">{brakesHealth}%</span>
                      </div>
                      <Progress value={brakesHealth} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {brakesHealth > 80
                          ? "Excellent condition. No action needed."
                          : brakesHealth > 60
                            ? "Good condition. Regular inspection recommended."
                            : "Fair condition. Service recommended."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Scheduled Maintenance</CardTitle>
                    <CardDescription>Upcoming maintenance appointments</CardDescription>
                  </div>
                  <Button onClick={() => setIsScheduleDialogOpen(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Maintenance
                  </Button>
                </CardHeader>
                <CardContent>
                  {scheduledMaintenance.length > 0 ? (
                    <div className="space-y-4">
                      {scheduledMaintenance.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">{item.type}</div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-2 h-4 w-4" />
                              {item.date}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-2 h-4 w-4" />
                              {item.time}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleRescheduleMaintenance(item.id)}>
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCancelMaintenance(item.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No scheduled maintenance</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You don't have any maintenance appointments scheduled
                      </p>
                      <Button onClick={() => setIsScheduleDialogOpen(true)}>Schedule Maintenance</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                  <CardDescription>Record of past maintenance activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {maintenanceHistory.length > 0 ? (
                    <div className="space-y-4">
                      {maintenanceHistory.map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{item.type}</div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-2 h-4 w-4" />
                              {item.date}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">Technician: {item.technician}</div>
                          <div className="text-sm">{item.notes}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <History className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No maintenance history</h3>
                      <p className="text-sm text-muted-foreground">
                        Your maintenance history will appear here once you've had service
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="predictive">
              <Card>
                <CardHeader>
                  <CardTitle>Predictive Maintenance Alerts</CardTitle>
                  <CardDescription>AI-powered maintenance recommendations based on usage patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                      <div className="flex items-start space-x-4">
                        <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium text-amber-800">Tire Replacement Recommended</h3>
                          <p className="text-sm text-amber-700 mb-2">
                            Based on your usage patterns, we recommend replacing your tires within the next 30 days.
                            Current wear pattern indicates uneven tread wear.
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="bg-white">
                              Schedule Service
                            </Button>
                            <Button variant="ghost" size="sm">
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <Wrench className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium">Regular Maintenance Due</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Your vehicle is due for its regular 3-month maintenance check. We recommend scheduling a
                            general inspection.
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Schedule Service
                            </Button>
                            <Button variant="ghost" size="sm">
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-start space-x-4">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium text-green-800">Battery Health Optimal</h3>
                          <p className="text-sm text-green-700 mb-2">
                            Your battery is performing well. Based on your usage patterns, we estimate 6+ months of
                            remaining life.
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </div>
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

      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>Select the type of maintenance and preferred date/time</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="maintenance-type">Maintenance Type</Label>
              <Select defaultValue="general">
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inspection</SelectItem>
                  <SelectItem value="battery">Battery Service</SelectItem>
                  <SelectItem value="motor">Motor Service</SelectItem>
                  <SelectItem value="tires">Tire Replacement</SelectItem>
                  <SelectItem value="brakes">Brake Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue="2025-06-01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" defaultValue="11:00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input id="notes" placeholder="Any specific issues or concerns" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMaintenance}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
