"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface User {
  id: string
  name: string
  email: string
  points: number
  badges: string[]
  rank: number
  joinedAt: Date
  isAdmin: boolean
}

export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  completed: boolean
  progress: number
  target: number
  type: "distance" | "eco" | "safety"
}

interface UserContextType {
  currentUser: User | null
  users: User[]
  challenges: Challenge[]
  leaderboard: User[]
  addUser: (user: Omit<User, "id" | "joinedAt" | "points" | "badges" | "rank">) => void
  updateUser: (user: Partial<User> & { id: string }) => void
  deleteUser: (id: string) => void
  login: (email: string) => void
  logout: () => void
  addPoints: (points: number) => void
  addBadge: (badge: string) => void
  updateChallengeProgress: (id: string, progress: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Sample users data
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    points: 1250,
    badges: ["Eco Champion", "Safe Driver", "Speed Demon"],
    rank: 1,
    joinedAt: new Date(2023, 0, 15),
    isAdmin: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    points: 980,
    badges: ["Eco Champion", "Night Rider"],
    rank: 2,
    joinedAt: new Date(2023, 1, 20),
    isAdmin: false,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    points: 750,
    badges: ["Safe Driver"],
    rank: 3,
    joinedAt: new Date(2023, 2, 10),
    isAdmin: false,
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    points: 620,
    badges: ["Speed Demon"],
    rank: 4,
    joinedAt: new Date(2023, 3, 5),
    isAdmin: false,
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    points: 480,
    badges: [],
    rank: 5,
    joinedAt: new Date(2023, 4, 12),
    isAdmin: false,
  },
]

// Sample challenges
const sampleChallenges: Challenge[] = [
  {
    id: "1",
    title: "Green Mile",
    description: "Travel 5km in eco-mode",
    points: 50,
    completed: false,
    progress: 2.5,
    target: 5,
    type: "distance",
  },
  {
    id: "2",
    title: "Safe Journey",
    description: "Complete a trip with no obstacles",
    points: 100,
    completed: false,
    progress: 0,
    target: 1,
    type: "safety",
  },
  {
    id: "3",
    title: "Eco Warrior",
    description: "Achieve an A eco-score on 3 trips",
    points: 150,
    completed: false,
    progress: 1,
    target: 3,
    type: "eco",
  },
]

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [challenges, setChallenges] = useState<Challenge[]>(sampleChallenges)
  const [leaderboard, setLeaderboard] = useState<User[]>([])
  const { toast } = useToast()

  // Initialize with a default user for demo purposes
  useEffect(() => {
    setCurrentUser(sampleUsers[0])
  }, [])

  // Update leaderboard when users change
  useEffect(() => {
    const sortedUsers = [...users].sort((a, b) => b.points - a.points)
    const rankedUsers = sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }))
    setLeaderboard(rankedUsers)
  }, [users])

  const addUser = useCallback(
    (user: Omit<User, "id" | "joinedAt" | "points" | "badges" | "rank">) => {
      const newUser: User = {
        ...user,
        id: Math.random().toString(36).substring(2, 9),
        points: 0,
        badges: [],
        rank: users.length + 1,
        joinedAt: new Date(),
      }

      setUsers((prev) => [...prev, newUser])

      toast({
        title: "User Added",
        description: `${user.name} has been added successfully.`,
      })
    },
    [users.length, toast],
  )

  const updateUser = useCallback(
    (user: Partial<User> & { id: string }) => {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...user } : u)))

      setCurrentUser((prev) => (prev && prev.id === user.id ? { ...prev, ...user } : prev))

      toast({
        title: "User Updated",
        description: "User information has been updated.",
      })
    },
    [toast],
  )

  const deleteUser = useCallback(
    (id: string) => {
      setUsers((prev) => prev.filter((u) => u.id !== id))

      toast({
        title: "User Deleted",
        description: "User has been removed from the system.",
      })
    },
    [toast],
  )

  const login = useCallback(
    (email: string) => {
      const user = users.find((u) => u.email === email)

      if (user) {
        setCurrentUser(user)
        toast({
          title: "Logged In",
          description: `Welcome back, ${user.name}!`,
        })
      } else {
        toast({
          title: "Login Failed",
          description: "User not found.",
          variant: "destructive",
        })
      }
    },
    [users, toast],
  )

  const logout = useCallback(() => {
    setCurrentUser(null)
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
    })
  }, [toast])

  const addPoints = useCallback(
    (points: number) => {
      if (!currentUser) return

      const updatedUser = {
        ...currentUser,
        points: currentUser.points + points,
      }

      setCurrentUser(updatedUser)

      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)))

      toast({
        title: "Points Added",
        description: `You earned ${points} points!`,
      })
    },
    [currentUser, toast],
  )

  const addBadge = useCallback(
    (badge: string) => {
      if (!currentUser) return
      if (currentUser.badges.includes(badge)) return

      const updatedUser = {
        ...currentUser,
        badges: [...currentUser.badges, badge],
      }

      setCurrentUser(updatedUser)

      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)))

      toast({
        title: "Badge Earned",
        description: `You earned the ${badge} badge!`,
      })
    },
    [currentUser, toast],
  )

  const updateChallengeProgress = useCallback(
    (id: string, progress: number) => {
      setChallenges((prev) =>
        prev.map((challenge) => {
          if (challenge.id === id) {
            const newProgress = Math.min(challenge.progress + progress, challenge.target)
            const completed = newProgress >= challenge.target && !challenge.completed

            // Create a new challenge object with updated properties
            const updatedChallenge = {
              ...challenge,
              progress: newProgress,
              completed: newProgress >= challenge.target,
            }

            // If the challenge was just completed, schedule the points award
            if (completed) {
              // Use setTimeout to move the state update out of the render phase
              setTimeout(() => {
                addPoints(challenge.points)
                toast({
                  title: "Challenge Completed",
                  description: `You completed the ${challenge.title} challenge!`,
                })
              }, 0)
            }

            return updatedChallenge
          }
          return challenge
        }),
      )
    },
    [addPoints, toast],
  )

  const value = {
    currentUser,
    users,
    challenges,
    leaderboard,
    addUser,
    updateUser,
    deleteUser,
    login,
    logout,
    addPoints,
    addBadge,
    updateChallengeProgress,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
