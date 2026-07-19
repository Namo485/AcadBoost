'use server';

/**
 * @fileOverview An educational chatbot AI agent.
 *
 * - educhat - A function that handles the chatbot interaction.
 * - EduChatInput - The input type for the educhat function.
 * - EduChatOutput - The return type for the educhat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EduChatInputSchema = z.object({
  query: z.string().describe("The user's question or topic."),
});
export type EduChatInput = z.infer<typeof EduChatInputSchema>;

const LinkSchema = z.object({
  title: z.string().describe('The title of the web page.'),
  url: z.string().url().describe('The URL of the resource.'),
});

const EduChatOutputSchema = z.object({
  answer: z
    .string()
    .describe("A comprehensive and helpful answer to the user's query."),
  youtubeSearchSuggestions: z
    .array(z.string())
    .describe(
      'A list of 2-3 relevant YouTube search query suggestions for the user to explore.'
    ),
  webLinks: z.array(LinkSchema).describe('A list of relevant browser links.'),
});
export type EduChatOutput = z.infer<typeof EduChatOutputSchema>;

export async function educhat(input: EduChatInput): Promise<EduChatOutput> {
  return educhatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'educhatPrompt',
  input: { schema: EduChatInputSchema },
  output: { schema: EduChatOutputSchema },
  prompt: `You are EduChat, a friendly and knowledgeable AI assistant for the AcadBoost platform. Your goal is to provide clear, concise, and helpful answers to user questions.

In addition to answering the question, you MUST provide at least 2 relevant web links to help the user learn more.
You MUST also suggest 2-3 relevant YouTube search queries (as simple strings) that the user can use to find videos on the topic.

The user's query is: {{{query}}}

Provide your answer, search suggestions, and web links in the structured output format.`,
});

const educhatFlow = ai.defineFlow(
  {
    name: 'educhatFlow',
    inputSchema: EduChatInputSchema,
    outputSchema: EduChatOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      
      if (!output) {
        throw new Error('The AI model failed to generate a valid response.');
      }
      
      // Ensure arrays exist, even if empty, to prevent validation issues.
      return {
        answer: output.answer || 'I was unable to find an answer.',
        youtubeSearchSuggestions: output.youtubeSearchSuggestions || [],
        webLinks: output.webLinks || [],
      };

    } catch (error: any) {
      console.error('[EduChat Flow Error]', error);
      
      let errorMessage = `I encountered an issue while trying to help: ${error.message}. Please try again.`;
      
      if (error.message && error.message.includes('Schema validation failed')) {
        errorMessage = `I had a problem formatting my response. The AI model returned data that didn't match the expected structure. Please try again.`;
      }

      // Return a structured error response that conforms to the schema
      return {
        answer: errorMessage,
        youtubeSearchSuggestions: [],
        webLinks: [],
      };
    }
  }
);
