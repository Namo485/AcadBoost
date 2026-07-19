'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Book, CheckCircle, Clock, Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useMemo } from "react";
import type { User as UserEntity } from '@/lib/types';

interface EnrolledCourse {
    progress: number;
}

export function StatsCards() {
    const { user } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserEntity>(userDocRef);

    const userProgressQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, `users/${user.uid}/progress`);
    }, [firestore, user]);

    const { data: enrolledCourses, isLoading: areCoursesLoading } = useCollection<EnrolledCourse>(userProgressQuery);

    const formatTime = (seconds: number = 0) => {
        const hours = Math.floor(seconds / 3600);
        return `${hours}h`;
    };

    const stats = useMemo(() => {
        if (!enrolledCourses) {
            return {
                inProgress: 0,
                completed: 0,
            };
        }
        const inProgress = enrolledCourses.filter(c => c.progress < 100).length;
        const completed = enrolledCourses.filter(c => c.progress === 100).length;
        return { inProgress, completed };
    }, [enrolledCourses]);

    const statCards = [
        { name: 'Courses in Progress', value: stats.inProgress, icon: Book },
        { name: 'Courses Completed', value: stats.completed, icon: CheckCircle },
        { name: 'Average Score', value: '87%', icon: Star },
        { name: 'Time Spent', value: formatTime(userProfile?.timeSpent), icon: Clock },
    ];


    if (areCoursesLoading || isProfileLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <Skeleton className="h-4 w-2/3" />
                           <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-8 w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
                <Card key={stat.name} className="shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
