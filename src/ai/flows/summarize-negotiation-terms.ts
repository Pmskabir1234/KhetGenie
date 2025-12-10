'use server';

/**
 * @fileOverview Summarizes negotiation terms from a conversation between a farmer and a buyer.
 *
 * - summarizeNegotiationTerms - A function that summarizes the negotiation terms.
 * - SummarizeNegotiationTermsInput - The input type for the summarizeNegotiationTerms function.
 * - SummarizeNegotiationTermsOutput - The return type for the summarizeNegotiationTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNegotiationTermsInputSchema = z.object({
  conversation: z
    .string()
    .describe(
      'A conversation between a farmer and a buyer, detailing the negotiation process.'
    ),
});
export type SummarizeNegotiationTermsInput = z.infer<
  typeof SummarizeNegotiationTermsInputSchema
>;

const SummarizeNegotiationTermsOutputSchema = z.object({
  agreementReached: z
    .boolean()
    .describe('Whether an agreement has been reached between the parties.'),
  pricePerKg: z
    .number()
    .nullable()
    .describe('The agreed price per kilogram of the crop.'),
  quantity: z.number().nullable().describe('The agreed quantity of the crop.'),
  notes: z
    .string()
    .describe('Any additional notes or conditions of the agreement.'),
  warnings: z.array(z.string()).describe('Any potential misunderstandings.'),
});
export type SummarizeNegotiationTermsOutput = z.infer<
  typeof SummarizeNegotiationTermsOutputSchema
>;

export async function summarizeNegotiationTerms(
  input: SummarizeNegotiationTermsInput
): Promise<SummarizeNegotiationTermsOutput> {
  return summarizeNegotiationTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNegotiationTermsPrompt',
  input: {schema: SummarizeNegotiationTermsInputSchema},
  output: {schema: SummarizeNegotiationTermsOutputSchema},
  prompt: `You are an AI assistant that summarizes negotiation terms between a farmer and a buyer from their conversation.

  Analyze the following conversation and extract the agreed terms, including price per kg, quantity, and any conditions.
  Detect any potential misunderstandings and output them as warnings.

  Conversation: {{{conversation}}}

  Based on the conversation, determine if an agreement has been reached.

  Output the results in JSON format, following the schema:
  ${JSON.stringify(SummarizeNegotiationTermsOutputSchema.shape, null, 2)}`,
});

const summarizeNegotiationTermsFlow = ai.defineFlow(
  {
    name: 'summarizeNegotiationTermsFlow',
    inputSchema: SummarizeNegotiationTermsInputSchema,
    outputSchema: SummarizeNegotiationTermsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
