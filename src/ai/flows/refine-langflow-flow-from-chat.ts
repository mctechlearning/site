// refine-langflow-flow-from-chat.ts
'use server';

/**
 * @fileOverview Refines an existing Langflow flow based on a chat conversation.
 *
 * - refineLangflowFlowFromChat - A function that refines the Langflow flow.
 * - RefineLangflowFlowFromChatInput - The input type for the refineLangflowFlowFromChat function.
 * - RefineLangflowFlowFromChatOutput - The return type for the refineLangflowFlowFromChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineLangflowFlowFromChatInputSchema = z.object({
  flowJson: z.string().describe('The existing Langflow JSON configuration as a string.'),
  chatHistory: z.string().describe('The chat history as a string.'),
});
export type RefineLangflowFlowFromChatInput = z.infer<typeof RefineLangflowFlowFromChatInputSchema>;

const RefineLangflowFlowFromChatOutputSchema = z.object({
  refinedFlowJson: z.string().describe('The refined Langflow JSON configuration as a string.'),
});
export type RefineLangflowFlowFromChatOutput = z.infer<typeof RefineLangflowFlowFromChatOutputSchema>;

export async function refineLangflowFlowFromChat(input: RefineLangflowFlowFromChatInput): Promise<RefineLangflowFlowFromChatOutput> {
  return refineLangflowFlowFromChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineLangflowFlowFromChatPrompt',
  input: {schema: RefineLangflowFlowFromChatInputSchema},
  output: {schema: RefineLangflowFlowFromChatOutputSchema},
  prompt: `You are a Langflow expert. You will be provided with an existing Langflow JSON configuration and a chat history. Based on the chat history, you will refine the Langflow JSON configuration.

Existing Langflow JSON Configuration:
{{{flowJson}}}

Chat History:
{{{chatHistory}}}

Refined Langflow JSON Configuration:`,
});

const refineLangflowFlowFromChatFlow = ai.defineFlow(
  {
    name: 'refineLangflowFlowFromChatFlow',
    inputSchema: RefineLangflowFlowFromChatInputSchema,
    outputSchema: RefineLangflowFlowFromChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      refinedFlowJson: output!.refinedFlowJson,
    };
  }
);
