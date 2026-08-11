import { LLMSelect } from "./LLMSelect";


export class Groq implements LLMSelect {
    constructor(
        private apiKey: string,
        private model = "llama-3.3-70b-versatile",
        private temperature = 1.2
    ) {}

    async generate(systemPrompt: string, userPrompt: string): Promise<string> {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                temperature: this.temperature,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                response_format: { type: "json_object" },
            }),
        });

        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Groq request failed: ${res.status} ${res.statusText}\n${errorBody}`);
        }

        const data = (await res.json()) as any;
        const text = data?.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error(`Groq response contained no text content: ${JSON.stringify(data)}`);
        }

        return text;
    }
}