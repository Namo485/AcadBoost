export const user = {
    name: 'John Doe',
    email: 'john.doe@email.com',
};

export const stats = [
    { name: 'Courses in Progress', value: '4', change: '+2' },
    { name: 'Courses Completed', value: '8', change: '+1' },
    { name: 'Average Score', value: '87%', change: '-2%' },
    { name: 'Time Spent', value: '26h', change: '+4h' },
];

export const progressData = [
  { month: 'Jan', score: 78 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 80 },
  { month: 'Apr', score: 88 },
  { month: 'May', score: 91 },
  { month: 'Jun', score: 89 },
];
// update 
export const courses = [
    { id: '1', title: 'Introduction to Python', category: 'Programming', progress: 75, imageUrl: 'python', enrolled: true },
    { id: '2', title: 'Advanced Calculus', category: 'Mathematics', progress: 45, imageUrl: 'calculus', enrolled: true },
    { id: '3', title: 'The History of Art', category: 'Arts & Humanities', progress: 90, imageUrl: 'art', enrolled: true },
    { id: '4', title: 'Machine Learning Basics', category: 'Programming', progress: 20, imageUrl: 'machine-learning', enrolled: true },
    { id: '5', title: 'Creative Writing Workshop', category: 'Arts & Humanities', progress: 0, imageUrl: 'writing', enrolled: false },
    { id: '6', title: 'Data Structures & Algorithms', category: 'Programming', progress: 0, imageUrl: 'dsa', enrolled: false },
    { id: '7', title: 'Linear Algebra', category: 'Mathematics', progress: 0, imageUrl: 'algebra', enrolled: false },
    { id: '8', title: 'Digital Photography', category: 'Arts & Humanities', progress: 0, imageUrl: 'photography', enrolled: false },
];

export const enrolledCourses = courses.filter(c => c.enrolled);

export const recommendations = [
    { title: 'Data Structures in Python', description: 'Deepen your Python skills.' },
    { title: 'Calculus II', description: 'A follow-up to Advanced Calculus.' },
    { title: 'Modern Art Movements', description: 'Expand your art history knowledge.' },
];
