"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/context/user-context"
import { Award, Trophy, Target, Leaf, Shield, Zap, Gift } from "lucide-react"

export default function GamificationPage() {
  const { currentUser, challenges } = useUser()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gamification</h1>
            <p className="text-muted-foreground">Earn points, badges, and complete challenges</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Green Points</CardTitle>
                <CardDescription>Your eco-friendly reward points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Leaf className="h-8 w-8 text-green-500 mr-4" />
                  <div className="text-4xl font-bold">{currentUser?.points || 0}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Earn points by completing eco-friendly trips and challenges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Badges</CardTitle>
                <CardDescription>Achievements you've earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-amber-500 mr-4" />
                  <div className="text-4xl font-bold">{currentUser?.badges.length || 0}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Unlock badges by reaching milestones and completing challenges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rank</CardTitle>
                <CardDescription>Your position on the leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-blue-500 mr-4" />
                  <div className="text-4xl font-bold">#{currentUser?.rank || "-"}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Compete with other users to climb the leaderboard</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="challenges" className="space-y-4">
            <TabsList>
              <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="challenges">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Challenges</CardTitle>
                  <CardDescription>Complete challenges to earn points and badges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {challenges.map((challenge) => (
                      <div key={challenge.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {challenge.type === "distance" && <Zap className="h-5 w-5 text-blue-500 mr-2" />}
                            {challenge.type === "eco" && <Leaf className="h-5 w-5 text-green-500 mr-2" />}
                            {challenge.type === "safety" && <Shield className="h-5 w-5 text-amber-500 mr-2" />}
                            <div className="font-medium">{challenge.title}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">{challenge.points} pts</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{challenge.description}</div>
                        <div className="flex items-center gap-2">
                          <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                          <div className="text-sm text-muted-foreground whitespace-nowrap">
                            {challenge.progress}/{challenge.target}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                  <CardDescription>Achievements you can earn through simulations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <Leaf className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-medium text-center">Eco Champion</h3>
                      <p className="text-sm text-muted-foreground text-center mt-2">Achieve an A eco-score on a trip</p>
                      <div className="mt-4">
                        {currentUser?.badges.includes("Eco Champion") ? (
                          <div className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Unlocked</div>
                        ) : (
                          <div className="px-3 py-1 bg-muted-foreground/20 text-muted-foreground text-sm rounded-full">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Shield className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-center">Safe Driver</h3>
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Complete a trip with no obstacles
                      </p>
                      <div className="mt-4">
                        {currentUser?.badges.includes("Safe Driver") ? (
                          <div className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Unlocked</div>
                        ) : (
                          <div className="px-3 py-1 bg-muted-foreground/20 text-muted-foreground text-sm rounded-full">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        <Zap className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="font-medium text-center">Speed Demon</h3>
                      <p className="text-sm text-muted-foreground text-center mt-2">Reach a speed of over 30 km/h</p>
                      <div className="mt-4">
                        {currentUser?.badges.includes("Speed Demon") ? (
                          <div className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Unlocked</div>
                        ) : (
                          <div className="px-3 py-1 bg-muted-foreground/20 text-muted-foreground text-sm rounded-full">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <Target className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-center">Explorer</h3>
                      <p className="text-sm text-muted-foreground text-center mt-2">Complete 5 different routes</p>
                      <div className="mt-4">
                        <div className="px-3 py-1 bg-muted-foreground/20 text-muted-foreground text-sm rounded-full">
                          Locked
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <Award className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="font-medium text-center">Night Rider</h3>
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Complete a trip in night conditions
                      </p>
                      <div className="mt-4">
                        {currentUser?.badges.includes("Night Rider") ? (
                          <div className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Unlocked</div>
                        ) : (
                          <div className="px-3 py-1 bg-muted-foreground/20 text-muted-foreground text-sm rounded-full">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
                      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <Trophy className="h-8 w-8 text-orange-600" />
                      </div>
                      <h3 className="font-medium text-center">Top Performer</h3>
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Reach the top 3 on the leaderboard
                      </p>
                      <div className="mt-4">
                        {currentUser?.rank <= 3 ? (
                          <div className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Unlocked</div>
                        ) : (
                          <div className="px-3 py-1 bg-muted-foreground/20 text-muted-foreground text-sm rounded-full">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards">
              <Card>
                <CardHeader>
                  <CardTitle>Rewards</CardTitle>
                  <CardDescription>Redeem your points for rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Free Ride</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center">
                            <Gift className="h-12 w-12 text-primary" />
                          </div>
                          <div className="text-sm text-muted-foreground text-center">
                            Get a free 30-minute ride on any vehicle
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-medium">500 points</div>
                            <Button size="sm" disabled={!currentUser || currentUser.points < 500}>
                              Redeem
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Premium Upgrade</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center">
                            <Award className="h-12 w-12 text-primary" />
                          </div>
                          <div className="text-sm text-muted-foreground text-center">
                            Upgrade to premium features for 1 month
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-medium">1000 points</div>
                            <Button size="sm" disabled={!currentUser || currentUser.points < 1000}>
                              Redeem
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Eco Merchandise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center">
                            <Leaf className="h-12 w-12 text-primary" />
                          </div>
                          <div className="text-sm text-muted-foreground text-center">
                            Eco-friendly merchandise and accessories
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-medium">1500 points</div>
                            <Button size="sm" disabled={!currentUser || currentUser.points < 1500}>
                              Redeem
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
