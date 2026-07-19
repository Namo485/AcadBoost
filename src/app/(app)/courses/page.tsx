
import { courseData } from '@/lib/courses';
import { CourseCard } from '@/components/courses/course-card';

export default function CoursesPage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Explore Courses</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our curated list of courses and resources to enhance your skills.
        </p>
      </div>

      {courseData.map((category) => (
        <section key={category.name}>
          <h2 className="text-2xl font-bold font-headline mb-6">{category.name}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// Courses section
