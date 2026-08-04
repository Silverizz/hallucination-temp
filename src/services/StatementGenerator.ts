import { LLMProvider } from "../llm/LLMProvider";
import { SYSTEM_PROMPT } from "../prompt";
import { Statement } from "../type";

export class StatementGenerator {
    constructor(private llm: LLMProvider) {}

    async generate(
        topic: string,
        difficulty: Statement["difficulty"]
    ): Promise<Statement> {
        const userPrompt = `Topic: ${topic}\nDifficulty: ${difficulty}`;

        const raw = await this.llm.generate(SYSTEM_PROMPT, userPrompt);

        let parsed: Statement;
        try {
            parsed = JSON.parse(this.stripMarkdownFences(raw));
        } catch (err) {
            throw new Error(
                `LLM returned invalid JSON, could not parse statement: ${err}\n\nRaw response:\n${raw}`
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

    private validate(statement: Statement) {
        if (typeof statement.text !== "string" || statement.text.trim().length === 0) {
            throw new Error("Statement is missing a valid 'text' field");
        }

        if (typeof statement.isTrue !== "boolean") {
            throw new Error(`Expected 'isTrue' to be a boolean, got ${typeof statement.isTrue}`);
        }

        if (typeof statement.explanation !== "string" || statement.explanation.trim().length === 0) {
            throw new Error("Statement is missing a valid 'explanation' field");
        }
    }
}