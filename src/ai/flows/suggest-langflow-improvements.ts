'use server';
/**
 * @fileOverview A Langflow flow improvement suggestion AI agent.
 *
 * - suggestLangflowImprovements - A function that suggests improvements to a Langflow flow.
 * - SuggestLangflowImprovementsInput - The input type for the suggestLangflowImprovements function.
 * - SuggestLangflowImprovementsOutput - The return type for the suggestLangflowImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLangflowImprovementsInputSchema = z.object({
  langflowJson: z
    .string()
    .describe('The Langflow JSON configuration to improve.'),
  instructions: z
    .string()
    .describe('Instructions for what to improve in the Langflow JSON.'),
});
export type SuggestLangflowImprovementsInput =
  z.infer<typeof SuggestLangflowImprovementsInputSchema>;

const SuggestLangflowImprovementsOutputSchema = z.object({
  improvedLangflowJson: z
    .string()
    .describe('The improved Langflow JSON configuration.'),
  explanation: z
    .string()
    .describe('Explanation of the improvements made.'),
});
export type SuggestLangflowImprovementsOutput =
  z.infer<typeof SuggestLangflowImprovementsOutputSchema>;

export async function suggestLangflowImprovements(
  input: SuggestLangflowImprovementsInput
): Promise<SuggestLangflowImprovementsOutput> {
  return suggestLangflowImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLangflowImprovementsPrompt',
  input: {schema: SuggestLangflowImprovementsInputSchema},
  output: {schema: SuggestLangflowImprovementsOutputSchema},
  prompt: `You are an AI expert in Langflow flow design. You take a Langflow JSON configuration and instructions on how to improve it, and return an improved Langflow JSON configuration and an explanation of the improvements made.

Langflow JSON:\n{{{langflowJson}}}

Instructions:\n{{{instructions}}}

Improved Langflow JSON:`,
});

const suggestLangflowImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestLangflowImprovementsFlow',
    inputSchema: SuggestLangflowImprovementsInputSchema,
    outputSchema: SuggestLangflowImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
