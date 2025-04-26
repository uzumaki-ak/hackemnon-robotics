"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  PenToolIcon as Tool,
} from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

export default function AdminMaintenancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const { toast } = useToast()

  const [maintenanceTasks, setMaintenanceTasks] = useState([
    {
      id: 1,
      vehicleName: "Scooter #2",
      taskType: "Battery Replacement",
      priority: "high",
      status: "scheduled",
      date: "2025-05-10",
      time: "10:00 AM",
      assignedTo: "John Smith",
      notes: "Battery degradation detected, needs immediate replacement",
    },
    {
      id: 2,
      vehicleName: "E-Bike #1",
      taskType: "Regular Inspection",
      priority: "medium",
      status: "scheduled",
      date: "2025-05-15",
      time: "2:00 PM",
      assignedTo: "Sarah Johnson",
      notes: "Quarterly inspection as per maintenance schedule",
    },
    {
      id: 3,
      vehicleName: "Delivery Robot #1",
      taskType: "Motor Repair",
      priority: "high",
      status: "in-progress",
      date: "2025-05-08",
      time: "9:00 AM",
      assignedTo: "Mike Wilson",
      notes: "Motor making unusual noise, needs inspection and possible repair",
    },
    {
      id: 4,
      vehicleName: "Scooter #1",
      taskType: "Tire Replacement",
      priority: "low",
      status: "completed",
      date: "2025-05-05",
      time: "11:00 AM",
      assignedTo: "John Smith",
      notes: "Replaced worn tires with new ones",
      completionNotes: "All tires replaced successfully, vehicle back in service",
    },
    {
      id: 5,
      vehicleName: "E-Bike #2",
      taskType: "Brake Adjustment",
      priority: "medium",
      status: "completed",
      date: "2025-05-03",
      time: "3:00 PM",
      assignedTo: "Sarah Johnson",
      notes: "Brakes not responding properly, need adjustment",
      completionNotes: "Adjusted brakes and replaced brake pads, now functioning properly",
    },
  ])

  const filteredTasks = maintenanceTasks.filter(
    (task) =>
      task.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const pendingTasks = filteredTasks.filter((task) => task.status === "scheduled" || task.status === "in-progress")
  const completedTasks = filteredTasks.filter((task) => task.status === "completed")

  const handleScheduleMaintenance = () => {
    const newTask = {
      id: maintenanceTasks.length + 1,
      vehicleName: "E-Bike #2",
      taskType: "General Inspection",
      priority: "medium",
      status: "scheduled",
      date: "2025-05-20",
      time: "11:00 AM",
      assignedTo: "John Smith",
      notes: "Regular maintenance inspection",
    }

    setMaintenanceTasks([...maintenanceTasks, newTask])
    setIsScheduleDialogOpen(false)

    toast({
      title: "Maintenance Scheduled",
      description: "New maintenance task has been scheduled",
    })
  }

  const handleCompleteTask = (id: number) => {
    setMaintenanceTasks(
      maintenanceTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "completed",
              completionNotes: "Task completed successfully",
            }
          : task,
      ),
    )

    toast({
      title: "Task Completed",
      description: "Maintenance task has been marked as completed",
    })
  }

  const handleCancelTask = (id: number) => {
    setMaintenanceTasks(maintenanceTasks.filter((task) => task.id !== id))

    toast({
      title: "Task Cancelled",
      description: "Maintenance task has been cancelled",
    })
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">High</span>
      case "medium":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Medium</span>
      case "low":
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Low</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Scheduled</span>
      case "in-progress":
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">In Progress</span>
      case "completed":
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Maintenance Management</h1>
              <p className="text-muted-foreground">Schedule and track maintenance tasks for your fleet</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsScheduleDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
            </div>
          </div>

          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
              <TabsTrigger value="reports">Maintenance Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Maintenance Tasks</CardTitle>
                  <CardDescription>Scheduled and in-progress maintenance tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingTasks.length > 0 ? (
                    <div className="space-y-4">
                      {pendingTasks.map((task) => (
                        <div key={task.id} className="flex items-center p-3 border rounded-lg">
                          <div
                            className={`w-2 h-full rounded-full mr-4 ${
                              task.priority === "high"
                                ? "bg-red-500"
                                : task.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {task.vehicleName} - {task.taskType}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Assigned to: {task.assignedTo} | {task.date} at {task.time}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div>{getPriorityBadge(task.priority)}</div>
                            <div>{getStatusBadge(task.status)}</div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Edit Task
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleCancelTask(task.id)} className="text-red-600">
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Cancel Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Tool className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No pending tasks</h3>
                      <p className="text-sm text-muted-foreground mb-4">All maintenance tasks have been completed</p>
                      <Button onClick={() => setIsScheduleDialogOpen(true)}>Schedule Maintenance</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Maintenance Tasks</CardTitle>
                  <CardDescription>History of completed maintenance tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  {completedTasks.length > 0 ? (
                    <div className="space-y-4">
                      {completedTasks.map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="font-medium">
                                {task.vehicleName} - {task.taskType}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Completed by: {task.assignedTo} | {task.date}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div>{getPriorityBadge(task.priority)}</div>
                              <div>{getStatusBadge(task.status)}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <div className="font-medium">Notes:</div>
                            <div className="text-muted-foreground">{task.notes}</div>
                          </div>
                          {task.completionNotes && (
                            <div className="mt-2 text-sm">
                              <div className="font-medium">Completion Notes:</div>
                              <div className="text-muted-foreground">{task.completionNotes}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No completed tasks</h3>
                      <p className="text-sm text-muted-foreground">Completed maintenance tasks will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Maintenance Reports</CardTitle>
                    <CardDescription>Generate and view maintenance reports</CardDescription>
                  </div>
                  <Button onClick={() => setIsReportDialogOpen(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Monthly Maintenance Summary</div>
                          <div className="text-sm text-muted-foreground">May 2025</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Report
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Vehicle Health Report</div>
                          <div className="text-sm text-muted-foreground">Scooter Fleet - Q2 2025</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Report
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Maintenance Cost Analysis</div>
                          <div className="text-sm text-muted-foreground">Q1 2025</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Statistics</CardTitle>
                <CardDescription>Overview of maintenance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Total Tasks</div>
                    <div className="text-2xl font-bold">{maintenanceTasks.length}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Pending Tasks</div>
                    <div className="text-2xl font-bold">
                      {maintenanceTasks.filter((task) => task.status !== "completed").length}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">High Priority</div>
                    <div className="text-2xl font-bold">
                      {maintenanceTasks.filter((task) => task.priority === "high").length}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Completion Rate</div>
                    <div className="text-2xl font-bold">
                      {Math.round(
                        (maintenanceTasks.filter((task) => task.status === "completed").length /
                          maintenanceTasks.length) *
                          100,
                      )}
                      %
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Maintenance</CardTitle>
                <CardDescription>Tasks scheduled for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceTasks
                    .filter((task) => task.status === "scheduled")
                    .slice(0, 3)
                    .map((task) => (
                      <div key={task.id} className="flex items-center">
                        <div className="mr-4">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {task.vehicleName} - {task.taskType}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {task.date} at {task.time}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>Schedule a new maintenance task</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select defaultValue="ebike-2">
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scooter-1">Scooter #1</SelectItem>
                  <SelectItem value="scooter-2">Scooter #2</SelectItem>
                  <SelectItem value="ebike-1">E-Bike #1</SelectItem>
                  <SelectItem value="ebike-2">E-Bike #2</SelectItem>
                  <SelectItem value="robot-1">Delivery Robot #1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-type">Maintenance Type</Label>
              <Select defaultValue="inspection">
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inspection">General Inspection</SelectItem>
                  <SelectItem value="battery">Battery Service</SelectItem>
                  <SelectItem value="motor">Motor Service</SelectItem>
                  <SelectItem value="tires">Tire Replacement</SelectItem>
                  <SelectItem value="brakes">Brake Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue="2025-05-20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" defaultValue="11:00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="technician">Assigned Technician</Label>
              <Select defaultValue="john">
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="mike">Mike Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Enter maintenance notes" />
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

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Maintenance Report</DialogTitle>
            <DialogDescription>Create a new maintenance report</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select defaultValue="summary">
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Monthly Summary</SelectItem>
                  <SelectItem value="vehicle">Vehicle Health Report</SelectItem>
                  <SelectItem value="cost">Cost Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-period">Time Period</Label>
              <Select defaultValue="may-2025">
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="may-2025">May 2025</SelectItem>
                  <SelectItem value="q2-2025">Q2 2025</SelectItem>
                  <SelectItem value="q1-2025">Q1 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-vehicles">Include Vehicles</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="scooters">Scooters Only</SelectItem>
                  <SelectItem value="ebikes">E-Bikes Only</SelectItem>
                  <SelectItem value="robots">Delivery Robots Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsReportDialogOpen(false)
                toast({
                  title: "Report Generated",
                  description: "Your maintenance report has been generated",
                })
              }}
            >
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
