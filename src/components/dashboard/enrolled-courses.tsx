'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Progress } from '../ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { courseData } from '@/lib/courses';

interface EnrolledCourse {
    id: string;
    courseId: string;
    title: string;
    category: string;
    progress: number;
    imageUrl: string;
    lastAccessed: any;
}

export function EnrolledCourses() {
    const { user } = useUser();
    const firestore = useFirestore();

    const userProgressQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, `users/${user.uid}/progress`),
            orderBy('lastAccessed', 'desc'),
            limit(3)
        );
    }, [firestore, user]);

    const { data: enrolledCourses, isLoading } = useCollection<EnrolledCourse>(userProgressQuery);

    const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);
    
    // Find the original course from the static course data to get the resourceUrl
    const findCourseUrl = (courseId: string) => {
        for (const category of courseData) {
            const course = category.courses.find(c => c.id === courseId);
            if (course) {
                return course.resourceUrl;
            }
        }
        return '/courses'; // Fallback link
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-headline">Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {isLoading && (
                        <>
                            <CourseSkeleton />
                            <CourseSkeleton />
                        </>
                    )}
                    {!isLoading && enrolledCourses && enrolledCourses.length > 0 && enrolledCourses.map(course => (
                        <div key={course.id} className="flex items-center gap-4 group">
                            <Image
                                src={getImage(course.imageUrl)?.imageUrl || ''}
                                alt={getImage(course.imageUrl)?.description || 'Course image'}
                                data-ai-hint={getImage(course.imageUrl)?.imageHint || ''}
                                width={120}
                                height={80}
                                className="rounded-lg object-cover aspect-[3/2] hidden sm:block"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{course.title}</h3>
                                <p className="text-sm text-muted-foreground">{course.category}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Progress value={course.progress} className="w-[60%]" />
                                    <span className="text-sm font-medium text-muted-foreground">{course.progress}%</span>
                                </div>
                            </div>
                            <Button asChild variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                <Link href={findCourseUrl(course.courseId)} target="_blank" rel="noopener noreferrer">
                                  Resume
                                </Link>
                            </Button>
                        </div>
                    ))}
                    {!isLoading && (!enrolledCourses || enrolledCourses.length === 0) && (
                        <div className="text-center text-muted-foreground py-8">
                            <p>You haven't started any courses yet.</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/courses">Explore Courses</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                 <Button asChild variant="outline" className="w-full">
                    <Link href="/courses">
                        View All My Courses
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}


function CourseSkeleton() {
    return (
        <div className="flex items-center gap-4">
            <Skeleton className="w-[120px] h-[80px] rounded-lg hidden sm:block" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-2 mt-2">
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-4 w-8" />
                </div>
            </div>
        </div>
    );
}
