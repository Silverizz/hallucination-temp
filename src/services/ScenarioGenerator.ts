import { LLMProvider } from "../llm/LLMProvider";
import { SYSTEM_PROMPT } from "../prompt";
import { Scenario } from "../type";

export class ScenarioGenerator {
    constructor(private llm: LLMProvider) {}

    async generate(
        topic: string,
        difficulty: Scenario["difficulty"]
    ): Promise<Scenario> {
        const userPrompt = `Topic: ${topic}\nDifficulty: ${difficulty}`;

        const raw = await this.llm.generate(SYSTEM_PROMPT, userPrompt);

        let parsed: Scenario;
        try {
            parsed = JSON.parse(this.stripMarkdownFences(raw));
        } catch (err) {
            throw new Error(
                `LLM returned invalid JSON, could not parse scenario: ${err}\n\nRaw response:\n${raw}`
            );
        }

        this.validate(parsed);

        return parsed;
    }

    private stripMarkdownFences(text: string): string {
        return text
            .trim()
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/```\s*$/i, "");
    }

    private validate(scenario: Scenario) {
        if (!Array.isArray(scenario.claims) || scenario.claims.length !== 4) {
            throw new Error(
                `Expected exactly 4 claims, got ${scenario.claims?.length ?? 0}`
            );
        }

        const falseClaims = scenario.claims.filter((c) => c.truth === false);
        if (falseClaims.length !== 1) {
            throw new Error(
                `Expected exactly 1 false claim, got ${falseClaims.length}`
            );
        }
    }
}