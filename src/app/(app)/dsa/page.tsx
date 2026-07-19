
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';

export default function DSAPage() {
  const dataStructures = [
    { name: 'Arrays', description: 'A collection of items stored at contiguous memory locations.' },
    { name: 'Linked Lists', description: 'A linear collection of data elements where each element points to the next.' },
    { name: 'Stacks', description: 'A Last-In, First-Out (LIFO) data structure.' },
    { name: 'Queues', description: 'A First-In, First-Out (FIFO) data structure.' },
    { name: 'Trees', description: 'Hierarchical data structures, like binary trees, AVL trees, and B-trees.' },
    { name: 'Graphs', description: 'A collection of nodes (vertices) and edges that connect them.' },
    { name: 'Hash Tables', description: 'Data structures that implement an associative array abstract data type, mapping keys to values.' },
  ];

  const algorithms = [
    { name: 'Sorting Algorithms', description: 'Methods to arrange elements in a particular order (e.g., Bubble Sort, Merge Sort, Quick Sort).' },
    { name: 'Searching Algorithms', description: 'Methods to find a specific element within a data structure (e.g., Linear Search, Binary Search).' },
    { name: 'Graph Algorithms', description: 'Algorithms for traversing and analyzing graphs (e.g., Dijkstra\'s, BFS, DFS).' },
    { name: 'Dynamic Programming', description: 'An optimization technique that solves complex problems by breaking them into simpler subproblems.' },
    { name: 'Greedy Algorithms', description: 'Algorithms that make locally optimal choices at each stage with the hope of finding a global optimum.' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-4xl font-headline text-primary">Data Structures and Algorithms (DSA)</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            DSA are fundamental concepts in computer science that are essential for efficient programming and problem-solving. Mastering them is crucial for aspiring software developers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Separator />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-headline font-semibold">Data Structures</h2>
              <p className="text-muted-foreground">
                Data Structures are ways of organizing and storing data in a computer so that it can be accessed and modified efficiently. They are the building blocks of any software application.
              </p>
              <ul className="space-y-4">
                {dataStructures.map((item) => (
                  <li key={item.name} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-headline font-semibold">Algorithms</h2>
              <p className="text-muted-foreground">
                Algorithms are a set of well-defined instructions or a step-by-step procedure to solve a specific problem or perform a computation. They are independent of programming languages.
              </p>
              <ul className="space-y-4">
                {algorithms.map((item) => (
                  <li key={item.name} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// Specilized page for DSA 
