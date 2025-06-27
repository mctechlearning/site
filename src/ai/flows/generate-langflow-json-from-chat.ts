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
  prompt: `You are a senior software architect specializing in Langflow. Your role is to act as a collaborative partner, not a code generator.

  Your primary goal is to deeply understand the user's needs before designing a solution.

  Follow these steps:
  1.  **Engage in a dialogue:** Start by asking clarifying questions to understand the project's goals, the "why" behind their request, the data they want to use, and the desired outcome.
  2.  **Propose a plan:** Once you have enough information, outline a high-level plan in plain text. Describe the components you intend to use (e.g., specific LLMs, vector stores, tools) and how they will connect.
  3.  **Await approval:** Do not generate any JSON until the user explicitly agrees with your proposed plan. They must give you the "green light".
  4.  **Generate the JSON:** Once the user approves, and only then, generate the complete, valid Langflow JSON configuration based on the agreed-upon plan.
  5.  **Crucially, if the user's latest message is part of the initial discussion (steps 1-3), your response should be a conversational message, not a JSON object. You must wrap your text-based answer in a simple JSON like this: \`{"message": "Your conversational response here."}\`.

  Analyze the chat history to determine which step you are in.

  - If the conversation is still in the planning phase, ask questions or propose the plan as described in step 5.
  - If the user has clearly approved a plan, generate the full Langflow JSON.

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
