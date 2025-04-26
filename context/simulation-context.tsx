"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export type VehicleType = "scooter" | "ebike" | "delivery-robot"
export type TerrainType = "flat" | "uphill" | "bumpy"
export type WeatherType = "sunny" | "rainy" | "night"
export type TrafficType = "low" | "medium" | "high"

export interface Checkpoint {
  id: number
  lat: number
  lng: number
  name: string
  reached: boolean
}

export interface RouteInfo {
  startLocation: string
  startCoords: [number, number]
  endLocation: string
  endCoords: [number, number]
  checkpoints: Checkpoint[]
  distance: number // in km
  estimatedTime: number // in minutes
}

export interface SimulationSettings {
  vehicleType: VehicleType
  terrain: TerrainType
  weather: WeatherType
  traffic: TrafficType
  driverName: string
  route: RouteInfo | null
}

export interface PerformanceMetrics {
  speed: number // km/h
  battery: number // percentage
  distance: number // km
  motorTemp: number // celsius
  estimatedRange: number // km
  batteryUsed: number // percentage
  timeRemaining: number // minutes
  checkpointsPassed: number
  totalCheckpoints: number
  carbonSaved: number // kg
  ecoScore: "A" | "B" | "C" | "D" | "F"
  obstaclesEncountered: number
}

export interface TripSummary extends PerformanceMetrics {
  totalTime: number // minutes
  startTime: Date
  endTime: Date
  averageSpeed: number
  maxSpeed: number
  route: RouteInfo
  badges: string[]
  pointsEarned: number
}

interface SimulationContextType {
  isSimulationSetup: boolean
  isSimulationRunning: boolean
  isSimulationPaused: boolean
  isAutoPilot: boolean
  settings: SimulationSettings
  metrics: PerformanceMetrics
  tripHistory: TripSummary[]
  currentPosition: [number, number] | null
  targetSpeed: number
  setTargetSpeed: (speed: number) => void
  toggleAutoPilot: () => void
  setupSimulation: (settings: SimulationSettings) => void
  startSimulation: () => void
  pauseSimulation: () => void
  resumeSimulation: () => void
  stopSimulation: () => void
  resetSimulation: () => void
  emergencyStop: () => void
  currentTrip: TripSummary | null
}

const defaultSettings: SimulationSettings = {
  vehicleType: "scooter",
  terrain: "flat",
  weather: "sunny",
  traffic: "low",
  driverName: "User",
  route: null,
}

const defaultMetrics: PerformanceMetrics = {
  speed: 0,
  battery: 100,
  distance: 0,
  motorTemp: 25,
  estimatedRange: 30,
  batteryUsed: 0,
  timeRemaining: 0,
  checkpointsPassed: 0,
  totalCheckpoints: 0,
  carbonSaved: 0,
  ecoScore: "A",
  obstaclesEncountered: 0,
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  // Use refs for values that shouldn't trigger re-renders
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const obstacleIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const simulationStartTimeRef = useRef<Date | null>(null)

  // State
  const [isSimulationSetup, setIsSimulationSetup] = useState(false)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [isSimulationPaused, setIsSimulationPaused] = useState(false)
  const [isAutoPilot, setIsAutoPilot] = useState(false)
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings)
  const [metrics, setMetrics] = useState<PerformanceMetrics>(defaultMetrics)
  const [tripHistory, setTripHistory] = useState<TripSummary[]>([])
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null)
  const [targetSpeed, setTargetSpeed] = useState(0)
  const [currentTrip, setCurrentTrip] = useState<TripSummary | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  // Helper functions that don't update state
  const calculateBatteryDrain = useCallback(
    (currentSpeed: number) => {
      let drainRate = 0.05 // base drain per interval (percentage)

      // Adjust based on terrain
      if (settings.terrain === "uphill") drainRate *= 2
      if (settings.terrain === "bumpy") drainRate *= 1.5

      // Adjust based on speed
      drainRate *= currentSpeed / 15 + 0.5

      // Adjust based on weather
      if (settings.weather === "rainy") drainRate *= 1.2

      return drainRate
    },
    [settings.terrain, settings.weather],
  )

  const calculateMotorTemp = useCallback(
    (currentSpeed: number) => {
      const baseTemp = 25
      let tempIncrease = 0

      // Adjust based on speed
      tempIncrease += currentSpeed * 0.2

      // Adjust based on terrain
      if (settings.terrain === "uphill") tempIncrease += 5
      if (settings.terrain === "bumpy") tempIncrease += 3

      // Adjust based on weather
      if (settings.weather === "sunny") tempIncrease += 2
      if (settings.weather === "rainy") tempIncrease -= 1

      return Math.min(baseTemp + tempIncrease, 80) // Cap at 80°C
    },
    [settings.terrain, settings.weather],
  )

  const calculateCarbonSavings = useCallback((distance: number) => {
    // Average car emits ~120g CO2 per km
    return distance * 0.12 // kg of CO2 saved
  }, [])

  const calculateEcoScore = useCallback((speed: number, motorTemp: number) => {
    let score = 100

    // Penalize for high speed
    if (speed > 30) score -= (speed - 30) * 2

    // Penalize for high motor temperature
    if (motorTemp > 50) score -= (motorTemp - 50) * 1.5

    // Convert numerical score to letter grade
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }, [])

  // Clear all intervals
  const clearAllIntervals = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current)
      simulationIntervalRef.current = null
    }
    if (obstacleIntervalRef.current) {
      clearInterval(obstacleIntervalRef.current)
      obstacleIntervalRef.current = null
    }
  }, [])

  // Stop simulation
  const stopSimulation = useCallback(() => {
    clearAllIntervals()
    setIsSimulationRunning(false)
    setIsSimulationPaused(false)

    toast({
      title: "Simulation Stopped",
      description: "Your journey has been stopped.",
    })
  }, [clearAllIntervals, toast])

  // Complete simulation
  const completeSimulation = useCallback(() => {
    if (!simulationStartTimeRef.current) return

    const endTime = new Date()
    const durationMs = endTime.getTime() - simulationStartTimeRef.current.getTime()
    const durationMinutes = durationMs / (1000 * 60)

    // Generate badges
    const badges = []
    if (metrics.ecoScore === "A") badges.push("Eco Champion")
    if (metrics.obstaclesEncountered === 0) badges.push("Safe Driver")
    if (metrics.speed > 30) badges.push("Speed Demon")

    // Calculate points
    const basePoints = metrics.distance * 10
    const ecoBonus = metrics.ecoScore === "A" ? 50 : metrics.ecoScore === "B" ? 30 : 0
    const safetyBonus = metrics.obstaclesEncountered === 0 ? 50 : 0
    const totalPoints = Math.round(basePoints + ecoBonus + safetyBonus)

    const tripSummary: TripSummary = {
      ...metrics,
      totalTime: durationMinutes,
      startTime: simulationStartTimeRef.current,
      endTime,
      averageSpeed: metrics.distance / (durationMinutes / 60),
      maxSpeed: metrics.speed, // This is simplified, would track max in a real app
      route: settings.route!,
      badges,
      pointsEarned: totalPoints,
    }

    clearAllIntervals()

    // Batch state updates
    setCurrentTrip(tripSummary)
    setTripHistory((prev) => [...prev, tripSummary])
    setIsSimulationRunning(false)
    setIsSimulationPaused(false)

    toast({
      title: "Destination Reached",
      description: "Congratulations! You've completed your journey.",
    })

    // Navigate to summary
    router.push("/simulation/summary")
  }, [metrics, settings.route, clearAllIntervals, toast, router])

  // Update metrics - now doesn't call other state-updating functions directly
  const updateMetrics = useCallback(() => {
    if (!isSimulationRunning || isSimulationPaused) return

    setMetrics((prev) => {
      // Calculate new values
      const batteryDrain = calculateBatteryDrain(prev.speed)
      const newBattery = Math.max(prev.battery - batteryDrain, 0)
      const distanceIncrement = (prev.speed * (1 / 60)) / 60 // km per second
      const newDistance = prev.distance + distanceIncrement
      const newMotorTemp = calculateMotorTemp(prev.speed)
      const newCarbonSaved = calculateCarbonSavings(newDistance)
      const newEcoScore = calculateEcoScore(prev.speed, newMotorTemp) as "A" | "B" | "C" | "D" | "F"

      // Calculate remaining time based on route
      let newTimeRemaining = 0
      if (settings.route) {
        const remainingDistance = settings.route.distance - newDistance
        newTimeRemaining = prev.speed > 0 ? (remainingDistance / prev.speed) * 60 : 0
      }

      // Calculate estimated range
      const newEstimatedRange = (newBattery / 100) * 30 // 30km on full battery

      return {
        ...prev,
        battery: newBattery,
        distance: newDistance,
        motorTemp: newMotorTemp,
        estimatedRange: newEstimatedRange,
        batteryUsed: 100 - newBattery,
        timeRemaining: Math.max(0, newTimeRemaining),
        carbonSaved: newCarbonSaved,
        ecoScore: newEcoScore,
      }
    })
  }, [
    isSimulationRunning,
    isSimulationPaused,
    calculateBatteryDrain,
    calculateMotorTemp,
    calculateCarbonSavings,
    calculateEcoScore,
    settings.route,
  ])

  // Check conditions separately from updateMetrics
  useEffect(() => {
    if (!isSimulationRunning || isSimulationPaused) return

    // Check if battery is depleted
    if (metrics.battery <= 0) {
      toast({
        title: "Battery Depleted",
        description: "Your vehicle has run out of battery. Simulation stopped.",
        variant: "destructive",
      })
      stopSimulation()
    }

    // Check if destination reached
    if (settings.route && metrics.distance >= settings.route.distance) {
      completeSimulation()
    }
  }, [
    isSimulationRunning,
    isSimulationPaused,
    metrics.battery,
    metrics.distance,
    settings.route,
    toast,
    stopSimulation,
    completeSimulation,
  ])

  // Generate random obstacles
  const generateObstacle = useCallback(() => {
    if (!isSimulationRunning || isSimulationPaused) return

    // 10% chance of obstacle per interval
    if (Math.random() < 0.1) {
      const obstacles = ["pedestrian", "pothole", "car", "traffic light"]
      const obstacle = obstacles[Math.floor(Math.random() * obstacles.length)]

      toast({
        title: "Obstacle Detected",
        description: `${obstacle.charAt(0).toUpperCase() + obstacle.slice(1)} ahead! Slowing down.`,
        variant: "warning",
      })

      // Slow down temporarily
      setTargetSpeed((prev) => Math.max(prev - 5, 0))

      // Increment obstacle counter
      setMetrics((prev) => ({
        ...prev,
        obstaclesEncountered: prev.obstaclesEncountered + 1,
      }))
    }
  }, [isSimulationRunning, isSimulationPaused, toast])

  // Update position on map
  const updatePosition = useCallback(() => {
    if (!isSimulationRunning || isSimulationPaused || !settings.route) return

    const { startCoords, endCoords, distance } = settings.route

    // Calculate progress percentage
    const progress = Math.min(metrics.distance / distance, 1)

    // Linear interpolation between start and end
    const newLat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress
    const newLng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress

    setCurrentPosition([newLat, newLng])

    // Check for checkpoints
    if (settings.route.checkpoints) {
      let checkpointReached = false
      const updatedCheckpoints = [...settings.route.checkpoints]

      settings.route.checkpoints.forEach((checkpoint, index) => {
        if (!checkpoint.reached) {
          // Simple distance check (in a real app, would use proper geo calculations)
          const latDiff = Math.abs(newLat - checkpoint.lat)
          const lngDiff = Math.abs(newLng - checkpoint.lng)

          if (latDiff < 0.001 && lngDiff < 0.001) {
            // Mark checkpoint as reached
            updatedCheckpoints[index] = { ...checkpoint, reached: true }
            checkpointReached = true
          }
        }
      })

      if (checkpointReached) {
        // Update settings with new checkpoints
        setSettings((prev) => ({
          ...prev,
          route: {
            ...prev.route!,
            checkpoints: updatedCheckpoints,
          },
        }))

        // Update metrics for checkpoint
        setMetrics((prev) => ({
          ...prev,
          checkpointsPassed: prev.checkpointsPassed + 1,
        }))

        // Find the checkpoint that was just reached
        const reachedCheckpoint = updatedCheckpoints.find(
          (cp) => cp.reached && !settings.route!.checkpoints.find((oldCp) => oldCp.id === cp.id)?.reached,
        )

        if (reachedCheckpoint) {
          toast({
            title: "Checkpoint Reached",
            description: `You've reached ${reachedCheckpoint.name}`,
          })
        }
      }
    }
  }, [isSimulationRunning, isSimulationPaused, settings.route, metrics.distance, toast])

  // Auto-pilot logic - simplified to reduce state updates
  useEffect(() => {
    if (!isSimulationRunning || isSimulationPaused || !isAutoPilot) return

    const calculateOptimalSpeed = () => {
      let optimalSpeed = 25 // base optimal speed

      // Adjust based on terrain
      if (settings.terrain === "uphill") optimalSpeed -= 5
      if (settings.terrain === "bumpy") optimalSpeed -= 3

      // Adjust based on traffic
      if (settings.traffic === "medium") optimalSpeed -= 5
      if (settings.traffic === "high") optimalSpeed -= 10

      // Adjust based on weather
      if (settings.weather === "rainy") optimalSpeed -= 5
      if (settings.weather === "night") optimalSpeed -= 3

      return optimalSpeed
    }

    const interval = setInterval(() => {
      const optimalSpeed = calculateOptimalSpeed()

      setMetrics((prev) => {
        // Gradually approach optimal speed
        let newSpeed = prev.speed
        if (Math.abs(newSpeed - optimalSpeed) > 1) {
          newSpeed += newSpeed < optimalSpeed ? 1 : -1
        } else {
          newSpeed = optimalSpeed
        }

        return {
          ...prev,
          speed: newSpeed,
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isSimulationRunning, isSimulationPaused, isAutoPilot, settings])

  // Manual speed control - simplified
  useEffect(() => {
    if (!isSimulationRunning || isSimulationPaused || isAutoPilot) return

    const interval = setInterval(() => {
      setMetrics((prev) => {
        let newSpeed = prev.speed

        if (Math.abs(newSpeed - targetSpeed) > 1) {
          newSpeed += newSpeed < targetSpeed ? 1 : -1
        } else {
          newSpeed = targetSpeed
        }

        return {
          ...prev,
          speed: newSpeed,
        }
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isSimulationRunning, isSimulationPaused, isAutoPilot, targetSpeed])

  // Main simulation loop - using refs to avoid dependency issues
  useEffect(() => {
    if (isSimulationRunning && !isSimulationPaused) {
      // Clear any existing intervals first
      clearAllIntervals()

      const interval = setInterval(() => {
        updateMetrics()
        updatePosition()
      }, 1000)

      simulationIntervalRef.current = interval

      const obstacleInt = setInterval(() => {
        generateObstacle()
      }, 10000)

      obstacleIntervalRef.current = obstacleInt

      return () => {
        clearInterval(interval)
        clearInterval(obstacleInt)
      }
    }

    return () => {
      clearAllIntervals()
    }
  }, [isSimulationRunning, isSimulationPaused, updateMetrics, updatePosition, generateObstacle, clearAllIntervals])

  // Setup simulation
  const setupSimulation = useCallback(
    (newSettings: SimulationSettings) => {
      // Reset everything first
      clearAllIntervals()
      setIsSimulationRunning(false)
      setIsSimulationPaused(false)

      // Then set up the new simulation
      setSettings(newSettings)
      setIsSimulationSetup(true)
      setMetrics({
        ...defaultMetrics,
        totalCheckpoints: newSettings.route?.checkpoints.length || 0,
      })

      // Set initial position
      if (newSettings.route) {
        setCurrentPosition(newSettings.route.startCoords)
      }

      toast({
        title: "Simulation Setup Complete",
        description: "You're ready to start your journey!",
      })
    },
    [clearAllIntervals, toast],
  )

  // Start simulation
  const startSimulation = useCallback(() => {
    if (!isSimulationSetup) {
      toast({
        title: "Simulation Not Setup",
        description: "Please complete the simulation setup first.",
        variant: "destructive",
      })
      return
    }

    // Only set these states if they're not already set
    if (!isSimulationRunning) {
      simulationStartTimeRef.current = new Date()
      setIsSimulationRunning(true)
      setIsSimulationPaused(false)

      toast({
        title: "Simulation Started",
        description: "Your journey has begun!",
      })

      // Navigate to dashboard
      router.push("/simulation/dashboard")
    }
  }, [isSimulationSetup, isSimulationRunning, toast, router])

  // Pause simulation
  const pauseSimulation = useCallback(() => {
    setIsSimulationPaused(true)

    toast({
      title: "Simulation Paused",
      description: "Your journey is paused. Resume when ready.",
    })
  }, [toast])

  // Resume simulation
  const resumeSimulation = useCallback(() => {
    setIsSimulationPaused(false)

    toast({
      title: "Simulation Resumed",
      description: "Your journey continues!",
    })
  }, [toast])

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setMetrics(defaultMetrics)
    setCurrentPosition(settings.route?.startCoords || null)
    setTargetSpeed(0)

    toast({
      title: "Simulation Reset",
      description: "All metrics have been reset to initial values.",
    })
  }, [settings.route, toast])

  // Emergency stop
  const emergencyStop = useCallback(() => {
    stopSimulation()

    toast({
      title: "Emergency Stop Activated",
      description: "Simulation has been stopped immediately.",
      variant: "destructive",
    })
  }, [stopSimulation, toast])

  // Toggle auto-pilot - simplified to avoid state dependency
  const toggleAutoPilot = useCallback(() => {
    setIsAutoPilot((prev) => {
      const newValue = !prev

      toast({
        title: prev ? "Manual Control Activated" : "Auto-Pilot Activated",
        description: prev
          ? "You now have manual control of your vehicle."
          : "The vehicle will now drive automatically.",
      })

      return newValue
    })
  }, [toast])

  const value = {
    isSimulationSetup,
    isSimulationRunning,
    isSimulationPaused,
    isAutoPilot,
    settings,
    metrics,
    tripHistory,
    currentPosition,
    targetSpeed,
    setTargetSpeed,
    toggleAutoPilot,
    setupSimulation,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stopSimulation,
    resetSimulation,
    emergencyStop,
    currentTrip,
  }

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider")
  }
  return context
}
