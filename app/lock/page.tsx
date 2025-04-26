"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Lock, Unlock, AlertTriangle, Fingerprint } from "lucide-react"

export default function LockPage() {
  const [isLocked, setIsLocked] = useState(false)
  const [isRemoteLockEnabled, setIsRemoteLockEnabled] = useState(true)
  const [isAutoLockEnabled, setIsAutoLockEnabled] = useState(false)
  const [isGeofencingEnabled, setIsGeofencingEnabled] = useState(false)
  const { toast } = useToast()

  const handleToggleLock = () => {
    setIsLocked(!isLocked)

    toast({
      title: isLocked ? "Vehicle Unlocked" : "Vehicle Locked",
      description: isLocked
        ? "Your vehicle is now unlocked and ready to use."
        : "Your vehicle is now locked and secured.",
      variant: isLocked ? "default" : "default",
    })
  }

  const handleEmergencyLock = () => {
    setIsLocked(true)

    toast({
      title: "Emergency Lock Activated",
      description: "Your vehicle has been locked immediately.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Lock</h1>
            <p className="text-muted-foreground">Control the locking mechanism of your vehicle</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Lock Status</CardTitle>
                <CardDescription>Current status of your vehicle's lock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                  <div
                    className={`
                    w-24 h-24 rounded-full flex items-center justify-center
                    ${isLocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}
                  `}
                  >
                    {isLocked ? <Lock className="h-12 w-12" /> : <Unlock className="h-12 w-12" />}
                  </div>
                  <h2 className="text-2xl font-bold">{isLocked ? "Vehicle Locked" : "Vehicle Unlocked"}</h2>
                  <p className="text-muted-foreground text-center max-w-md">
                    {isLocked
                      ? "Your vehicle is currently locked and secured. Unlock it to use."
                      : "Your vehicle is currently unlocked and ready to use."}
                  </p>
                  <Button
                    size="lg"
                    onClick={handleToggleLock}
                    variant={isLocked ? "default" : "outline"}
                    className="mt-4"
                  >
                    {isLocked ? (
                      <>
                        <Unlock className="mr-2 h-4 w-4" />
                        Unlock Vehicle
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Lock Vehicle
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lock Settings</CardTitle>
                <CardDescription>Configure your vehicle's locking behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="remote-lock">Remote Lock</Label>
                      <p className="text-sm text-muted-foreground">Allow locking and unlocking from the app</p>
                    </div>
                    <Switch id="remote-lock" checked={isRemoteLockEnabled} onCheckedChange={setIsRemoteLockEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-lock">Auto Lock</Label>
                      <p className="text-sm text-muted-foreground">Automatically lock after 5 minutes of inactivity</p>
                    </div>
                    <Switch id="auto-lock" checked={isAutoLockEnabled} onCheckedChange={setIsAutoLockEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="geofencing">Geofencing Lock</Label>
                      <p className="text-sm text-muted-foreground">Lock when vehicle leaves designated area</p>
                    </div>
                    <Switch id="geofencing" checked={isGeofencingEnabled} onCheckedChange={setIsGeofencingEnabled} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Controls</CardTitle>
                <CardDescription>Emergency locking options for your vehicle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                    <div className="flex items-start space-x-4">
                      <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-medium text-amber-800">Emergency Lock</h3>
                        <p className="text-sm text-amber-700 mb-4">
                          Immediately lock your vehicle in case of emergency. This will override any current settings.
                        </p>
                        <Button variant="destructive" onClick={handleEmergencyLock}>
                          <Lock className="mr-2 h-4 w-4" />
                          Emergency Lock
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <Fingerprint className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-medium">Biometric Unlock</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Use fingerprint or face recognition to unlock your vehicle.
                        </p>
                        <Button variant="outline">
                          <Fingerprint className="mr-2 h-4 w-4" />
                          Setup Biometric
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
