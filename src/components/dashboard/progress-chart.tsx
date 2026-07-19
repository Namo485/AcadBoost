"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { progressData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

const chartConfig = {
    score: {
      label: "Average Score",
      color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function ProgressChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Your Progress Over Time</CardTitle>
                <CardDescription>Average quiz scores for the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={progressData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={8}
                                domain={[70, 100]}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Line
                                dataKey="score"
                                type="monotone"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                dot={{
                                    r: 5,
                                    fill: "hsl(var(--primary))",
                                    stroke: "hsl(var(--card))",
                                    strokeWidth: 2,
                                }}
                                activeDot={{
                                    r: 7,
                                    fill: "hsl(var(--primary))",
                                    stroke: "hsl(var(--card))",
                                    strokeWidth: 2,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
