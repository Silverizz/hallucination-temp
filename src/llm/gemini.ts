import { LLMSelect } from "./LLMSelect";

/**
 * IMPORTANT
 * Model names on Google's side get retired every few months T_T, this
 * one is scheduled for retirement around October 2026, at which point
 * "gemini-3.1-flash-lite" is the equivalent replacement. Check
 * https://ai.google.dev for the current list if this stops working.
 */
export class Gemini implements LLMSelect {
    constructor(
        private apiKey: string,
        private model = "gemini-2.5-flash-lite",
        private temperature = 1.4
    ) {}
 
    async generate(systemPrompt: string, userPrompt: string): Promise<string> {
        const maxAttempts = 3;
 
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: systemPrompt }] },
                        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                        generationConfig: {
                            response_mime_type: "application/json",
                            temperature: this.temperature,
                        },
                    }),
                }
            );
 
            if (res.ok) {
                const data = (await res.json()) as any;
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
 
                if (!text) {
                    throw new Error(
                        `Gemini response contained no text content: ${JSON.stringify(data)}`
                    );
                }
 
                return text;
            }
 
            //Retries if we get 503 from gemini
            const isRetryable = res.status === 503;
            const errorBody = await res.text();
 
            if (!isRetryable || attempt === maxAttempts) {
                throw new Error(`Gemini request failed: ${res.status} ${res.statusText}\n${errorBody}`);
            }
 
            const delayMs = 500 * attempt; // 500ms, then 1000ms
            console.warn(`Gemini returned 503 (overloaded), retrying in ${delayMs}ms... (attempt ${attempt}/${maxAttempts})`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
 
        throw new Error("Unreachable");
    }
}