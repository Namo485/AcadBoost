'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function searchYoutube(query: string) {
    if (!YOUTUBE_API_KEY) {
      // Return a structured error message instead of throwing an error.
      // This allows the calling flow to handle it gracefully.
      return {
        error: true,
        message:
          "I can't search for videos right now. This might be because the YouTube API key is missing or invalid. However, I can still try to answer your question.",
      };
    }
  
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&key=${YOUTUBE_API_KEY}&type=video&maxResults=5`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('YouTube API Error:', response.statusText);
        const errorBody = await response.text();
        console.error('YouTube API Response:', errorBody);
        return {
          error: true,
          message: `I encountered an error with the YouTube API: ${response.statusText}`,
        };
      }
      const data = await response.json();
      return data.items.map((item: any) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));
    } catch (e: any) {
      console.error('Failed to fetch from YouTube API:', e);
      return {
        error: true,
        message: 'There was a network problem when trying to search YouTube.',
      };
    }
}
  // For Youtube api Access 
export const youtubeVideoTool = ai.defineTool(
    {
      name: 'searchYoutube',
      description: 'Searches YouTube for videos based on a query.',
      inputSchema: z.string(),
      outputSchema: z.any(),
    },
    async (query) => {
        return await searchYoutube(query);
    }
);
