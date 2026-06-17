'use server';
/**
 * @fileOverview An AI Admission Advisor that recommends personalized educational pathways.
 *
 * - aiAdmissionAdvisor - A function that handles the admission advisory process.
 * - AIAdmissionAdvisorInput - The input type for the aiAdmissionAdvisor function.
 * - AIAdmissionAdvisorOutput - The return type for the aiAdmissionAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIAdmissionAdvisorInputSchema = z.object({
  qualifications: z
    .string()
    .describe('The prospective student\u0027s academic qualifications.'),
  careerGoals: z
    .string()
    .describe('The prospective student\u0027s future career goals.'),
});
export type AIAdmissionAdvisorInput = z.infer<typeof AIAdmissionAdvisorInputSchema>;

const AIAdmissionAdvisorOutputSchema = z.object({
  recommendedPathways: z
    .array(z.string())
    .describe('A list of recommended educational pathways or programs.'),
  reasoning: z
    .string()
    .describe('The explanation for the recommended pathways based on qualifications and career goals.'),
  suitableCourses: z
    .array(z.string())
    .describe('Specific courses within the recommended pathways that are well-suited.'),
});
export type AIAdmissionAdvisorOutput = z.infer<typeof AIAdmissionAdvisorOutputSchema>;

export async function aiAdmissionAdvisor(
  input: AIAdmissionAdvisorInput
): Promise<AIAdmissionAdvisorOutput> {
  return aiAdmissionAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAdmissionAdvisorPrompt',
  input: {schema: AIAdmissionAdvisorInputSchema},
  output: {schema: AIAdmissionAdvisorOutputSchema},
  prompt: `You are an intelligent AI Admission Advisor for Siksha Wallah Hub. Your goal is to help prospective students find the ideal educational pathway based on their academic qualifications and career goals.

Student's Qualifications: {{{qualifications}}}
Student's Career Goals: {{{careerGoals}}}

Based on the provided information, recommend suitable educational pathways and specific courses. Provide a clear reasoning for your recommendations.
`,
});

const aiAdmissionAdvisorFlow = ai.defineFlow(
  {
    name: 'aiAdmissionAdvisorFlow',
    inputSchema: AIAdmissionAdvisorInputSchema,
    outputSchema: AIAdmissionAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
