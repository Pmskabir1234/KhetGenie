'use server';
/**
 * @fileOverview Provides price recommendations for crop listings based on crop type, region, and seasonality.
 *
 * - getPriceRecommendation - A function that takes crop details and returns a price recommendation.
 * - PriceRecommendationInput - The input type for the getPriceRecommendation function.
 * - PriceRecommendationOutput - The return type for the getPriceRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PriceRecommendationInputSchema = z.object({
  crop_name: z.string().describe('The name of the crop.'),
  region: z.string().describe('The region where the crop is grown.'),
  seasonality: z.string().optional().describe('The seasonality of the crop (e.g., summer, winter).'),
  quantity: z.number().describe('Quantity of the crop available (in KG).'),
});
export type PriceRecommendationInput = z.infer<typeof PriceRecommendationInputSchema>;

const PriceRecommendationOutputSchema = z.object({
  min_price: z.number().nullable().describe('The recommended minimum price per kg.'),
  max_price: z.number().nullable().describe('The recommended maximum price per kg.'),
  confidence: z.string().describe('The confidence level of the price recommendation (e.g., high, medium, low).'),
  justification: z.string().describe('A short justification for the price recommendation.'),
});
export type PriceRecommendationOutput = z.infer<typeof PriceRecommendationOutputSchema>;

export async function getPriceRecommendation(input: PriceRecommendationInput): Promise<PriceRecommendationOutput> {
  return priceRecommendationFlow(input);
}

const priceRecommendationPrompt = ai.definePrompt({
  name: 'priceRecommendationPrompt',
  input: {schema: PriceRecommendationInputSchema},
  output: {schema: PriceRecommendationOutputSchema},
  prompt: `You are an AI assistant helping farmers determine the right price for their crops.

  Based on the following information, provide a price recommendation:

  Crop: {{{crop_name}}}
  Region: {{{region}}}
  Seasonality: {{{seasonality}}}
  Quantity: {{{quantity}}} KG

  Consider common market behavior and seasonality indicators when making your recommendation.
  Provide a fair minimum price per kg and a fair maximum price per kg.
  Also, provide a short justification for your recommendation and a confidence level.

  Ensure that the prices are reasonable and reflect current market conditions.
  The price should be in local currency.
`,
});

const priceRecommendationFlow = ai.defineFlow(
  {
    name: 'priceRecommendationFlow',
    inputSchema: PriceRecommendationInputSchema,
    outputSchema: PriceRecommendationOutputSchema,
  },
  async input => {
    const {output} = await priceRecommendationPrompt(input);
    return output!;
  }
);
