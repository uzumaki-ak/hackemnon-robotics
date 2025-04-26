"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import { Settings, Save, RefreshCw, Volume2, VolumeX, Bell, BellOff, Moon, Sun } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const { user, updateUserPreferences } = useUser()

  const [generalSettings, setGeneralSettings] = useState({
    darkMode: user.preferences.darkMode,
    notifications: user.preferences.notifications,
    sound: user.preferences.sound,
    language: user.preferences.language,
    autoSave: user.preferences.autoSave,
  })

  const [simulationSettings, setSimulationSettings] = useState({
    difficulty: user.preferences.difficulty,
    realisticPhysics: user.preferences.realisticPhysics,
    showTips: user.preferences.showTips,
    autoPilotAssist: user.preferences.autoPilotAssist,
    weatherEffects: user.preferences.weatherEffects,
    volume: user.preferences.volume,
  })

  const [privacySettings, setPrivacySettings] = useState({
    shareData: user.preferences.shareData,
    locationTracking: user.preferences.locationTracking,
    saveHistory: user.preferences.saveHistory,
    anonymousUsage: user.preferences.anonymousUsage,
  })

  const saveSettings = (settingsType: "general" | "simulation" | "privacy") => {
    const newPreferences = {
      ...user.preferences,
      ...(settingsType === "general" ? generalSettings : {}),
      ...(settingsType === "simulation" ? simulationSettings : {}),
      ...(settingsType === "privacy" ? privacySettings : {}),
    }

    updateUserPreferences(newPreferences)

    toast({
      title: "Settings Saved",
      description: `Your ${settingsType} settings have been updated.`,
    })
  }

  const resetSettings = (settingsType: "general" | "simulation" | "privacy") => {
    const defaultGeneral = {
      darkMode: false,
      notifications: true,
      sound: true,
      language: "english",
      autoSave: true,
    }

    const defaultSimulation = {
      difficulty: "normal",
      realisticPhysics: true,
      showTips: true,
      autoPilotAssist: true,
      weatherEffects: true,
      volume: 70,
    }

    const defaultPrivacy = {
      shareData: false,
      locationTracking: true,
      saveHistory: true,
      anonymousUsage: true,
    }

    if (settingsType === "general") {
      setGeneralSettings(defaultGeneral)
    } else if (settingsType === "simulation") {
      setSimulationSettings(defaultSimulation)
    } else {
      setPrivacySettings(defaultPrivacy)
    }

    toast({
      title: "Settings Reset",
      description: `Your ${settingsType} settings have been reset to defaults.`,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and simulation settings.</p>
        </div>
        <Settings className="h-10 w-10 text-muted-foreground" />
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general application preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-muted-foreground" />
                  <Switch
                    id="dark-mode"
                    checked={generalSettings.darkMode}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, darkMode: checked })}
                  />
                  <Moon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable app notifications</p>
                </div>
                <div className="flex items-center space-x-2">
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                  <Switch
                    id="notifications"
                    checked={generalSettings.notifications}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, notifications: checked })}
                  />
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound">Sound</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable sound effects</p>
                </div>
                <div className="flex items-center space-x-2">
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                  <Switch
                    id="sound"
                    checked={generalSettings.sound}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, sound: checked })}
                  />
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={generalSettings.language}
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto Save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save simulation progress</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={generalSettings.autoSave}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, autoSave: checked })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => resetSettings("general")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={() => saveSettings("general")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Settings</CardTitle>
              <CardDescription>Customize your simulation experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={simulationSettings.difficulty}
                  onValueChange={(value) => setSimulationSettings({ ...simulationSettings, difficulty: value })}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="realistic-physics">Realistic Physics</Label>
                  <p className="text-sm text-muted-foreground">Enable more realistic physics simulation</p>
                </div>
                <Switch
                  id="realistic-physics"
                  checked={simulationSettings.realisticPhysics}
                  onCheckedChange={(checked) =>
                    setSimulationSettings({ ...simulationSettings, realisticPhysics: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-tips">Show Tips</Label>
                  <p className="text-sm text-muted-foreground">Display helpful tips during simulation</p>
                </div>
                <Switch
                  id="show-tips"
                  checked={simulationSettings.showTips}
                  onCheckedChange={(checked) => setSimulationSettings({ ...simulationSettings, showTips: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autopilot-assist">Auto-Pilot Assist</Label>
                  <p className="text-sm text-muted-foreground">Enable intelligent auto-pilot assistance</p>
                </div>
                <Switch
                  id="autopilot-assist"
                  checked={simulationSettings.autoPilotAssist}
                  onCheckedChange={(checked) =>
                    setSimulationSettings({ ...simulationSettings, autoPilotAssist: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weather-effects">Weather Effects</Label>
                  <p className="text-sm text-muted-foreground">Enable dynamic weather conditions</p>
                </div>
                <Switch
                  id="weather-effects"
                  checked={simulationSettings.weatherEffects}
                  onCheckedChange={(checked) =>
                    setSimulationSettings({ ...simulationSettings, weatherEffects: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="volume">Volume</Label>
                  <span className="text-sm text-muted-foreground">{simulationSettings.volume}%</span>
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={1}
                  value={[simulationSettings.volume]}
                  onValueChange={(value) => setSimulationSettings({ ...simulationSettings, volume: value[0] })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => resetSettings("simulation")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={() => saveSettings("simulation")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your data and privacy preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="share-data">Share Usage Data</Label>
                  <p className="text-sm text-muted-foreground">Share anonymous usage data to help improve the app</p>
                </div>
                <Switch
                  id="share-data"
                  checked={privacySettings.shareData}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, shareData: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="location-tracking">Location Tracking</Label>
                  <p className="text-sm text-muted-foreground">Allow location tracking during simulations</p>
                </div>
                <Switch
                  id="location-tracking"
                  checked={privacySettings.locationTracking}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, locationTracking: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-history">Save History</Label>
                  <p className="text-sm text-muted-foreground">Save your simulation history</p>
                </div>
                <Switch
                  id="save-history"
                  checked={privacySettings.saveHistory}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, saveHistory: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous-usage">Anonymous Usage</Label>
                  <p className="text-sm text-muted-foreground">Use the app without creating an account</p>
                </div>
                <Switch
                  id="anonymous-usage"
                  checked={privacySettings.anonymousUsage}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, anonymousUsage: checked })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => resetSettings("privacy")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={() => saveSettings("privacy")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
