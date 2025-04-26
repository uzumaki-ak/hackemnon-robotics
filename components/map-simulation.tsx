"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { RouteInfo } from "@/context/simulation-context"

interface MapSimulationProps {
  route: RouteInfo | null
  currentPosition: [number, number] | null
}

export default function MapSimulation({ route, currentPosition }: MapSimulationProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([40.7128, -74.006], 12)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)
    }

    // Clear existing route layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Polyline || (layer instanceof L.Marker && layer !== markerRef.current)) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // Add route markers and path if route exists
    if (route) {
      const { startCoords, endCoords, checkpoints } = route

      // Start marker
      L.marker(startCoords as L.LatLngExpression, {
        icon: L.divIcon({
          html: `<div class="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full">S</div>`,
          className: "",
        }),
      }).addTo(mapRef.current)

      // End marker
      L.marker(endCoords as L.LatLngExpression, {
        icon: L.divIcon({
          html: `<div class="flex items-center justify-center w-6 h-6 bg-destructive text-white rounded-full">E</div>`,
          className: "",
        }),
      }).addTo(mapRef.current)

      // Checkpoint markers
      checkpoints.forEach((checkpoint, index) => {
        L.marker([checkpoint.lat, checkpoint.lng] as L.LatLngExpression, {
          icon: L.divIcon({
            html: `<div class="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full">${index + 1}</div>`,
            className: "",
          }),
        }).addTo(mapRef.current)
      })

      // Create route path
      const routePoints = [
        startCoords as L.LatLngExpression,
        ...checkpoints.map((cp) => [cp.lat, cp.lng] as L.LatLngExpression),
        endCoords as L.LatLngExpression,
      ]

      L.polyline(routePoints, { color: "#3b82f6", weight: 4 }).addTo(mapRef.current)

      // Fit map to route bounds
      mapRef.current.fitBounds(routePoints)
    }

    return () => {
      // Clean up map on component unmount
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [route])

  // Update current position marker
  useEffect(() => {
    if (!mapRef.current || !currentPosition) return

    // Remove existing marker
    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current)
    }

    // Create new marker
    markerRef.current = L.marker(currentPosition as L.LatLngExpression, {
      icon: L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>`,
        className: "",
      }),
    }).addTo(mapRef.current)

    // Center map on current position
    mapRef.current.panTo(currentPosition as L.LatLngExpression)
  }, [currentPosition])

  return <div ref={mapContainerRef} className="h-full w-full" />
}
