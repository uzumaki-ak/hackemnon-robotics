"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/context/user-context"
import { Award, Medal, Trophy } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function LeaderboardPage() {
  const { leaderboard, currentUser } = useUser()

  // Get top 3 users
  const topUsers = leaderboard.slice(0, 3)

  // Get remaining users
  const remainingUsers = leaderboard.slice(3)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground">See how you rank against other users</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {topUsers.map((user, index) => (
              <Card
                key={user.id}
                className={
                  index === 0
                    ? "border-yellow-300 bg-yellow-50"
                    : index === 1
                      ? "border-gray-300 bg-gray-50"
                      : "border-amber-300 bg-amber-50"
                }
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>#{index + 1}</span>
                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {index === 1 && <Medal className="h-5 w-5 text-gray-500" />}
                    {index === 2 && <Medal className="h-5 w-5 text-amber-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {user.name}
                        {user.id === currentUser?.id && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Award className="h-4 w-4 mr-1" />
                        {user.points} points
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rankings</CardTitle>
              <CardDescription>All users ranked by points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {remainingUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-3 rounded-lg ${user.id === currentUser?.id ? "bg-muted" : ""}`}
                  >
                    <div className="font-medium w-12">#{user.rank}</div>
                    <Avatar className="h-8 w-8 mr-4">
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">
                        {user.name}
                        {user.id === currentUser?.id && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Award className="h-4 w-4 mr-1" />
                      {user.points} points
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
