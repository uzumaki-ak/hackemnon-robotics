"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/context/user-context"
import { Award, Medal, Trophy, Star, Calendar, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function AdminLeaderboardPage() {
  const { leaderboard } = useUser()
  const { toast } = useToast()

  // Get top 3 users
  const topUsers = leaderboard.slice(0, 3)

  // Get remaining users
  const remainingUsers = leaderboard.slice(3)

  // Weekly change indicators (mock data)
  const weeklyChanges = {
    "1": "same",
    "2": "up",
    "3": "up",
    "4": "down",
    "5": "down",
  }

  const handleResetLeaderboard = () => {
    toast({
      title: "Leaderboard Reset",
      description: "The leaderboard has been reset for the new period",
    })
  }

  const handleAwardBadge = (userId: string) => {
    toast({
      title: "Badge Awarded",
      description: "Special badge has been awarded to the user",
    })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Leaderboard Management</h1>
              <p className="text-muted-foreground">Manage user rankings and rewards</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleResetLeaderboard}>
                <Calendar className="mr-2 h-4 w-4" />
                Reset Leaderboard
              </Button>
            </div>
          </div>

          <Tabs defaultValue="current" className="space-y-4">
            <TabsList>
              <TabsTrigger value="current">Current Leaderboard</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Changes</TabsTrigger>
              <TabsTrigger value="rewards">Reward Management</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <Card>
                <CardHeader>
                  <CardTitle>Current Rankings</CardTitle>
                  <CardDescription>Current user rankings based on points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3 mb-6">
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
                              <div className="font-medium">{user.name}</div>
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

                  <div className="space-y-4">
                    {remainingUsers.map((user) => (
                      <div key={user.id} className="flex items-center p-3 rounded-lg border">
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
                          <div className="font-medium">{user.name}</div>
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
            </TabsContent>

            <TabsContent value="weekly">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Changes</CardTitle>
                  <CardDescription>User ranking changes over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((user) => (
                      <div key={user.id} className="flex items-center p-3 rounded-lg border">
                        <div className="font-medium w-12">#{user.rank}</div>
                        <div className="w-8 flex justify-center">
                          {weeklyChanges[user.id as keyof typeof weeklyChanges] === "up" && (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          )}
                          {weeklyChanges[user.id as keyof typeof weeklyChanges] === "down" && (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          )}
                          {weeklyChanges[user.id as keyof typeof weeklyChanges] === "same" && (
                            <Minus className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <Avatar className="h-8 w-8 mr-4">
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{user.name}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            <Award className="h-4 w-4 mr-1 inline" />
                            {user.points} points
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {weeklyChanges[user.id as keyof typeof weeklyChanges] === "up" && (
                              <span className="text-green-500">+45 pts</span>
                            )}
                            {weeklyChanges[user.id as keyof typeof weeklyChanges] === "down" && (
                              <span className="text-red-500">-20 pts</span>
                            )}
                            {weeklyChanges[user.id as keyof typeof weeklyChanges] === "same" && (
                              <span className="text-gray-500">No change</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards">
              <Card>
                <CardHeader>
                  <CardTitle>Reward Management</CardTitle>
                  <CardDescription>Manage badges and rewards for top performers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Top Performers</h3>
                      <div className="space-y-4">
                        {topUsers.map((user, index) => (
                          <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="font-medium w-8">#{index + 1}</div>
                              <Avatar className="h-8 w-8 mr-4">
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.points} points</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleAwardBadge(user.id)}>
                                <Star className="mr-2 h-4 w-4" />
                                Award Badge
                              </Button>
                              <Button variant="outline" size="sm">
                                <Award className="mr-2 h-4 w-4" />
                                Add Points
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Available Badges</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                            <Trophy className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="font-medium text-center">Champion</div>
                          <div className="text-xs text-muted-foreground text-center mt-1">For 1st place</div>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <Star className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="font-medium text-center">Rising Star</div>
                          <div className="text-xs text-muted-foreground text-center mt-1">Most improved</div>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                            <Award className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="font-medium text-center">Eco Hero</div>
                          <div className="text-xs text-muted-foreground text-center mt-1">Best eco score</div>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                            <Medal className="h-6 w-6 text-amber-600" />
                          </div>
                          <div className="font-medium text-center">Safety Pro</div>
                          <div className="text-xs text-muted-foreground text-center mt-1">Best safety record</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Leaderboard Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Reset Period</div>
                            <div className="text-sm text-muted-foreground">How often the leaderboard resets</div>
                          </div>
                          <Button variant="outline">Monthly</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Point Calculation</div>
                            <div className="text-sm text-muted-foreground">How points are calculated</div>
                          </div>
                          <Button variant="outline">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Reward Tiers</div>
                            <div className="text-sm text-muted-foreground">Set reward tiers for rankings</div>
                          </div>
                          <Button variant="outline">Configure</Button>
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
    </div>
  )
}
