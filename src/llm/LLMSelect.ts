export interface LLMSelect {
    generate(systemPrompt: string, userPrompt: string): Promise<string>;
}