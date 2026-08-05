import { LLMProvider } from "./LLMProvider";

/**
 * IMPORTANT
 * Model names on Google's side get retired every few months T_T, this
 * one is scheduled for retirement around October 2026, at which point
 * "gemini-3.1-flash-lite" is the equivalent replacement. Check
 * https://ai.google.dev for the current list if this stops working.
 */
export class GeminiProvider implements LLMProvider {
    constructor(
        private apiKey: string,
        private model = "gemini-2.5-flash-lite"
    ) {}

    async generate(systemPrompt: string, userPrompt: string): Promise<string> {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                
                //same flag as ollama.ts
                generationConfig: {
                    response_mime_type: "application/json",
                },
            }),
        });

        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Gemini request failed: ${res.status} ${res.statusText}\n${errorBody}`);
        }

        const data = (await res.json()) as any;
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error(`Gemini response contained no text content: ${JSON.stringify(data)}`);
        }

        return text;
    }
}