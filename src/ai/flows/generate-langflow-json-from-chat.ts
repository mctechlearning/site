'use server';

/**
 * @fileOverview A Langflow JSON flow generator AI agent.
 *
 * - generateLangflowJson - A function that handles the Langflow JSON flow generation process.
 * - GenerateLangflowJsonInput - The input type for the generateLangflowJson function.
 * - GenerateLangflowJsonOutput - The return type for the generateLangflowJson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLangflowJsonInputSchema = z.object({
  chatHistory: z
    .string()
    .describe('The chat history describing the desired Langflow flow.'),
});
export type GenerateLangflowJsonInput = z.infer<typeof GenerateLangflowJsonInputSchema>;

const GenerateLangflowJsonOutputSchema = z.object({
  langflowJson: z
    .string()
    .describe('The Langflow JSON configuration representing the generated flow.'),
});
export type GenerateLangflowJsonOutput = z.infer<typeof GenerateLangflowJsonOutputSchema>;

export async function generateLangflowJson(input: GenerateLangflowJsonInput): Promise<GenerateLangflowJsonOutput> {
  return generateLangflowJsonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLangflowJsonPrompt',
  input: {schema: GenerateLangflowJsonInputSchema},
  output: {schema: GenerateLangflowJsonOutputSchema},
  prompt: `You are an AI expert in Langflow, tasked with generating Langflow JSON configurations based on user descriptions.

  Instructions:
  - Carefully analyze the user's chat history to understand the desired Langflow flow.
  - Translate the user's requirements into a valid Langflow JSON configuration.
  - Ensure the generated JSON is well-formatted and adheres to Langflow's schema.
  - Consider various Langflow components such as chains, agents, prompts, and tools to construct the flow.
  - Always include necessary configurations for each component, such as API keys, model names, and parameters.
  - If the user asks to connect to services, consider using tools to retrieve external information.
  - Return ONLY valid JSON in the output.
  - Do not return any other text or explanation.
  - If the user has not provided enough information to generate the JSON, return a valid JSON with a message saying that more information is needed.

Chat History:
{{{chatHistory}}}`,
});

const generateLangflowJsonFlow = ai.defineFlow(
  {
    name: 'generateLangflowJsonFlow',
    inputSchema: GenerateLangflowJsonInputSchema,
    outputSchema: GenerateLangflowJsonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
