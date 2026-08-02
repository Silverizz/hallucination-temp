import { LLMProvider } from "./LLMProvider";

/**
 * Talks to a locally running Ollama instance (https://ollama.com).
 * No API key needed since  Ollama runs on your own machine and serves
 * open-source models like llama3, mistral, phi3, etc.
 *
 * Requires `ollama serve` to be running locally, and the model to
 * have been pulled first, e.g. `ollama pull llama3`.
 */
export class OllamaProvider implements LLMProvider {
    constructor(
        private model = "llama3",
        private baseUrl = "http://localhost:11434"
    ) {}

    async generate(systemPrompt: string, userPrompt: string): Promise<string> {
        const res = await fetch(`${this.baseUrl}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: this.model,
                system: systemPrompt,
                prompt: userPrompt,
                stream: false,
                format: "json",
            }),
        });

        if (!res.ok) {
            throw new Error(
                `Ollama request failed: ${res.status} ${res.statusText}`
            );
        }

        const data = (await res.json()) as { response: string };
        return data.response;
    }
}