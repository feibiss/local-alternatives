import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { ComponentProps } from "react"
import { Chart, type ChartData } from "~/app/admin/_components/chart"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"

const getSubscribers = async () => {
  "use cache"

  cacheTag("subscribers")
  cacheLife("minutes")

  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))
  const allSubscribers: { created: number }[] = []
  let totalResults = 0

  try {
    // Fetch subscriber data from your database instead of Beehiiv
    const subscribers = await fetchSubscribersFromDatabase()

    // Filter only subscribers from last 30 days
    const relevantSubscribers = subscribers.filter(
      sub => new Date(sub.created * 1000) >= thirtyDaysAgo,
    )

    allSubscribers.push(...relevantSubscribers)
    totalResults = allSubscribers.length

    // Group subscribers by date
    const subscribersByDate = allSubscribers.reduce<Record<string, number>>((acc, sub) => {
      const date = format(new Date(sub.created * 1000), "yyyy-MM-dd")
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    // Fill in missing dates with 0
    const results: ChartData[] = eachDayOfInterval({
      start: thirtyDaysAgo,
      end: new Date(),
    }).map(day => ({
      date: format(day, "yyyy-MM-dd"),
      value: subscribersByDate[format(day, "yyyy-MM-dd")] || 0,
    }))

    const averageSubscribers = results.reduce((sum, day) => sum + day.value, 0) / results.length

    return { results, totalSubscribers, averageSubscribers }
  } catch (error) {
    console.error("Subscribers error:", error)
    return { results: [], totalSubscribers: 0, averageSubscribers: 0 }
  }
}

const SubscribersCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const { results, totalSubscribers, averageSubscribers } = await getSubscribers()

  return (
    <Card hover={false} focus={false} {...props}>
      <CardHeader>
        <CardDescription>Subscribers</CardDescription>
        <span className="ml-auto text-xs text-muted-foreground">last 30 days</span>
        <H2 className="w-full">{totalSubscribers.toLocaleString()}</H2>
      </CardHeader>

      <Chart
        data={results}
        average={averageSubscribers}
        className="w-full"
        cellClassName="bg-chart-2"
        label="Subscriber"
      />
    </Card>
  )
}

export { SubscribersCard }
