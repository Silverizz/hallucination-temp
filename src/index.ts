import "dotenv/config";
import * as readline from "node:readline/promises";
import { OllamaProvider } from "./llm/ollama";
import { StatementGenerator } from "./services/StatementGenerator";
import { GameSession } from "./services/GameLogic";

async function main() {
    const llm = new OllamaProvider(
        process.env.OLLAMA_MODEL,
        process.env.OLLAMA_BASE_URL
    );
    const generator = new StatementGenerator(llm);

    console.log("Generating statement...\n");
    const statement = await generator.generate("History", "Medium");

    const session = new GameSession(statement);
    const publicStatement = session.getPublicStatement();

    console.log(`[${publicStatement.topic} - ${publicStatement.difficulty}]`);
    console.log(publicStatement.text);
    console.log();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await rl.question("True or False? (t/f): ");
    rl.close();

    const guess = answer.trim().toLowerCase().startsWith("t");
    const result = session.submitAnswer(guess);

    console.log();
    console.log(result.correct ? "✓ Correct!" : " ✘ Not quite");
    console.log(
        `The statement was actually: ${result.actualAnswer ? "TRUE" : "FALSE"}`
    );
    console.log(`Why: ${result.explanation}`);
    console.log(`Points earned: ${result.pointsAwarded}`);
    console.log(`Total score: ${session.getScore()}`);
}

main().catch(console.error);