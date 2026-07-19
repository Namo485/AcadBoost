'use server';

/**
 * @fileOverview A study plan generator AI agent.
 *
 * - generateStudyPlan - A function that handles the study plan generation process.
 * - GenerateStudyPlanInput - The input type for the generateStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generateStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyPlanInputSchema = z.object({
  learningGoals: z
    .string()
    .describe('The learning goals of the user.'),
  currentProgress: z
    .string()
    .describe('The current progress of the user in their studies.'),
  quizResults: z
    .string()
    .describe("The quiz results of the user. Include topics, scores, and areas needing improvement."),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const GenerateStudyPlanOutputSchema = z.object({
  studyPlan: z
    .string()
    .describe('A personalized study plan based on the user input.'),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {schema: GenerateStudyPlanInputSchema},
  output: {schema: GenerateStudyPlanOutputSchema},
  prompt: `You are an AI study plan generator that creates personalized study plans based on user learning goals, current progress, and quiz results.

  Learning Goals: {{{learningGoals}}}
  Current Progress: {{{currentProgress}}}
  Quiz Results: {{{quizResults}}}

  Based on the above information, generate a detailed and personalized study plan. The study plan should be clear, concise, and actionable, with specific topics to study, resources to use, and a schedule to follow.`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
