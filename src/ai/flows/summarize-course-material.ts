'use server';

/**
 * @fileOverview Summarizes lengthy course materials into concise summaries.
 *
 * - summarizeCourseMaterial - A function that summarizes course material.
 * - SummarizeCourseMaterialInput - The input type for the summarizeCourseMaterial function.
 * - SummarizeCourseMaterialOutput - The return type for the summarizeCourseMaterial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCourseMaterialInputSchema = z.object({
  courseMaterial: z
    .string()
    .describe('The lengthy course material to be summarized.'),
});
export type SummarizeCourseMaterialInput = z.infer<typeof SummarizeCourseMaterialInputSchema>;

const SummarizeCourseMaterialOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the course material.'),
});
export type SummarizeCourseMaterialOutput = z.infer<typeof SummarizeCourseMaterialOutputSchema>;

export async function summarizeCourseMaterial(
  input: SummarizeCourseMaterialInput
): Promise<SummarizeCourseMaterialOutput> {
  return summarizeCourseMaterialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCourseMaterialPrompt',
  input: {schema: SummarizeCourseMaterialInputSchema},
  output: {schema: SummarizeCourseMaterialOutputSchema},
  prompt: `Summarize the following course material into a concise summary:\n\n{{{courseMaterial}}}`,
});

const summarizeCourseMaterialFlow = ai.defineFlow(
  {
    name: 'summarizeCourseMaterialFlow',
    inputSchema: SummarizeCourseMaterialInputSchema,
    outputSchema: SummarizeCourseMaterialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
