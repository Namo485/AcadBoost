'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video, FileText, List, Info, PlusCircle } from 'lucide-react';
import type { Course } from '@/lib/courses';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
  course: Course;
}

// links for Courses and Youtube videos 

const typeIcons = {
  video: <Video className="h-4 w-4" />,
  course: <List className="h-4 w-4" />,
  webpage: <FileText className="h-4 w-4" />,
  playlist: <List className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

export function CourseCard({ course }: CourseCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === course.imageId);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleStartLearning = async () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You need to be logged in to start a course.',
      });
      router.push('/login');
      return;
    }

    // Open the course link in a new tab immediately
    window.open(course.resourceUrl, '_blank', 'noopener,noreferrer');

    try {
      // The progressId can be the courseId to ensure one progress doc per course
      const progressRef = doc(firestore, `users/${user.uid}/progress`, course.id); 
      
      await setDoc(progressRef, {
        id: course.id,
        userId: user.uid,
        courseId: course.id,
        title: course.title,
        imageUrl: course.imageId,
        category: course.category,
        progress: 0, // Start with 0 progress
        lastAccessed: serverTimestamp(),
      }, { merge: true });

      toast({
        title: 'Course Added!',
        description: `${course.title} is now on your dashboard.`,
      });
    } catch (error: any) {
      console.error('Error saving user progress:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your course progress.',
      });
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] w-full">
          {image && (
            <Image
              src={image.imageUrl}
              alt={image.description}
              data-ai-hint={image.imageHint}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant="secondary" className="capitalize bg-black/50 text-white backdrop-blur-sm">
              {typeIcons[course.type]}
              <span className="ml-1">{course.type}</span>
            </Badge>
            <Badge variant={course.isFree ? 'default' : 'destructive'} className="bg-black/50 text-white backdrop-blur-sm">
              {course.isFree ? 'Free' : 'Paid'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <h3 className="font-bold text-lg leading-tight line-clamp-2">{course.title}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleStartLearning} className="w-full">
          Start Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
