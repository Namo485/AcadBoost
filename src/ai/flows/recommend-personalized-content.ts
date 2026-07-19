'use server';

/**
 * @fileOverview AI flow to recommend personalized content based on user learning patterns, quiz results, and areas of interest.
 *
 * - recommendPersonalizedContent - A function that handles the content recommendation process.
 * - RecommendPersonalizedContentInput - The input type for the recommendPersonalizedContent function.
 * - RecommendPersonalizedContentOutput - The return type for the recommendPersonalizedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendPersonalizedContentInputSchema = z.object({
  learningPatterns: z
    .string()
    .describe('The learning patterns of the user, such as preferred learning styles and content types.'),
  quizResults: z
    .string()
    .describe('The quiz results of the user, including scores and areas of weakness.'),
  areasOfInterest: z.string().describe('The areas of interest of the user, such as specific topics or subjects.'),
  contentCatalog: z
    .string()
    .describe('A list of available courses and resources, each with a description.'),
});
export type RecommendPersonalizedContentInput = z.infer<
  typeof RecommendPersonalizedContentInputSchema
>;

const RecommendPersonalizedContentOutputSchema = z.object({
  recommendedContent: z
    .string()
    .describe('A list of recommended content items, tailored to the user\u2019s learning patterns, quiz results, and areas of interest.'),
});
export type RecommendPersonalizedContentOutput = z.infer<
  typeof RecommendPersonalizedContentOutputSchema
>;

export async function recommendPersonalizedContent(
  input: RecommendPersonalizedContentInput
): Promise<RecommendPersonalizedContentOutput> {
  return recommendPersonalizedContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPersonalizedContentPrompt',
  input: {schema: RecommendPersonalizedContentInputSchema},
  output: {schema: RecommendPersonalizedContentOutputSchema},
  prompt: `You are an AI-powered recommendation system designed to suggest personalized content to users based on their learning patterns, quiz results, and areas of interest.

  Analyze the user's learning patterns, quiz results, and areas of interest to identify relevant content from the content catalog.

  Learning Patterns: {{{learningPatterns}}}
  Quiz Results: {{{quizResults}}}
  Areas of Interest: {{{areasOfInterest}}}
  Content Catalog: {{{contentCatalog}}}

  Based on the above information, recommend a list of content items tailored to the user. Make sure each content in the list has a brief description.

  Here is the list of recommended content:`,
});

const recommendPersonalizedContentFlow = ai.defineFlow(
  {
    name: 'recommendPersonalizedContentFlow',
    inputSchema: RecommendPersonalizedContentInputSchema,
    outputSchema: RecommendPersonalizedContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
