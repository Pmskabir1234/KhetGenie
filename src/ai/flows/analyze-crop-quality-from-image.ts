'use server';
/**
 * @fileOverview Analyzes crop quality from an image and provides a grade, issues, and summary.
 *
 * - analyzeCropQualityFromImage - A function that handles the crop quality analysis process.
 * - AnalyzeCropQualityFromImageInput - The input type for the analyzeCropQualityFromImage function.
 * - AnalyzeCropQualityFromImageOutput - The return type for the analyzeCropQualityFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCropQualityFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCropQualityFromImageInput = z.infer<typeof AnalyzeCropQualityFromImageInputSchema>;

const AnalyzeCropQualityFromImageOutputSchema = z.object({
  quality_grade: z
    .enum(['A', 'B', 'C'])
    .describe('The quality grade of the crop (A, B, or C).'),
  visible_issues: z.array(z.string()).describe('A list of visible issues with the crop.'),
  summary: z.string().describe('A short explanation of the crop quality for farmers and buyers.'),
});
export type AnalyzeCropQualityFromImageOutput = z.infer<typeof AnalyzeCropQualityFromImageOutputSchema>;

export async function analyzeCropQualityFromImage(
  input: AnalyzeCropQualityFromImageInput
): Promise<AnalyzeCropQualityFromImageOutput> {
  return analyzeCropQualityFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCropQualityFromImagePrompt',
  input: {schema: AnalyzeCropQualityFromImageInputSchema},
  output: {schema: AnalyzeCropQualityFromImageOutputSchema},
  prompt: `You are an expert in crop quality analysis. Analyze the provided image of the crop and determine its quality.

  Based on the image, provide:
  - quality_grade: A grade of 'A', 'B', or 'C' representing the quality.
  - visible_issues: A list of any visible issues with the crop (e.g., discoloration, damage, pests).
  - summary: A short explanation of the crop quality, suitable for both farmers and buyers.

  Analyze the following image:
  {{media url=photoDataUri}}

  Ensure the output is a valid JSON object conforming to the AnalyzeCropQualityFromImageOutputSchema.
`,
});

const analyzeCropQualityFromImageFlow = ai.defineFlow(
  {
    name: 'analyzeCropQualityFromImageFlow',
    inputSchema: AnalyzeCropQualityFromImageInputSchema,
    outputSchema: AnalyzeCropQualityFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
