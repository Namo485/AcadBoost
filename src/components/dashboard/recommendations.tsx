
"use client"

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { recommendPersonalizedContent, RecommendPersonalizedContentOutput } from '@/ai/flows/recommend-personalized-content';
import { Skeleton } from '../ui/skeleton';
import { Lightbulb } from 'lucide-react';
import Link from 'next/link';

type Recommendation = {
    title: string;
    description: string;
};

const CACHE_KEY = 'acadboost-recommendations';
const ERROR_CACHE_KEY = 'acadboost-recommendations-error';

export function Recommendations() {
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Check for cached data first
                const cachedData = sessionStorage.getItem(CACHE_KEY);
                const cachedError = sessionStorage.getItem(ERROR_CACHE_KEY);

                if (cachedError) {
                    setError(cachedError);
                    setLoading(false);
                    return;
                }
                
                if (cachedData) {
                    setRecommendations(JSON.parse(cachedData));
                    setLoading(false);
                    return;
                }

                // If no cache, fetch from AI
                const input = {
                    learningPatterns: "Prefers video content and hands-on projects.",
                    quizResults: "Scored high in Python basics (95%), but lower in data structures (65%).",
                    areasOfInterest: "Machine Learning, Data Science.",
                    contentCatalog: "1. Introduction to Python. 2. Advanced Calculus. 3. The History of Art. 4. Machine Learning Basics. 5. Creative Writing Workshop. 6. Data Structures & Algorithms. 7. Linear Algebra. 8. Digital Photography."
                };
                
                const result: RecommendPersonalizedContentOutput = await recommendPersonalizedContent(input);

                const parsedRecs = result.recommendedContent
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0 && /^\d+\./.test(line))
                    .map(line => {
                        const parts = line.replace(/^\d+\.\s*/, '').split(' - ');
                        return {
                            title: parts[0] || 'Untitled',
                            description: parts[1] || 'No description'
                        }
                    });
                
                // Save to state and cache
                setRecommendations(parsedRecs);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(parsedRecs));

            } catch (err: any) {
                console.error("Failed to fetch recommendations:", err);
                let errorMessage = "Could not load recommendations at this time.";
                
                if (err.message && (err.message.includes('429') || err.message.toLowerCase().includes('quota exceeded'))) {
                    errorMessage = "Recommendation service is temporarily unavailable due to API limits. Please try again later.";
                }
                
                setError(errorMessage);
                sessionStorage.setItem(ERROR_CACHE_KEY, errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-accent" />
                    For You
                </CardTitle>
                <CardDescription>AI-powered suggestions to boost your learning.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading && (
                        <>
                            <RecommendationSkeleton />
                            <RecommendationSkeleton />
                            <RecommendationSkeleton />
                        </>
                    )}
                    {error && !loading && (
                        <p className="text-sm text-destructive text-center py-4">{error}</p>
                    )}
                    {!loading && !error && recommendations && recommendations.map((rec, index) => (
                        <Link href="#" key={index} className="block p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </Link>
                    ))}
                    {!loading && !error && (!recommendations || recommendations.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">No recommendations available right now.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function RecommendationSkeleton() {
    return (
        <div className="space-y-2 p-3">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
        </div>
    );
}
