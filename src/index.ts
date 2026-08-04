import "dotenv/config";
import * as readline from "node:readline/promises";
import { OllamaProvider } from "./llm/ollama";
import { ScenarioGenerator } from "./services/ScenarioGenerator";
import { GameSession } from "./services/GameLogic";

async function main() {
    const llm = new OllamaProvider(
        process.env.OLLAMA_MODEL,
        process.env.OLLAMA_BASE_URL
    );

    const generator = new ScenarioGenerator(llm);

    const scenario = await generator.generate("History", "Medium");

    const session = new GameSession(scenario);

    console.log(session.getQuestion());
    console.log();
    console.log(session.getResponseText());
    console.log();
    console.log("Which claim do you think is FALSE? \n");

    session.getPublicClaims().forEach((claim) => {console.log(`  [${claim.index}] ${claim.text}`)});



    // Temporary terminal input
    const r1 = readline.createInterface({input: process.stdin, output: process.stdout});
    const answer = await r1.question("\n Enter the number: ");
    r1.close();

    const result = session.submitAnswer(parseInt(answer, 10));

    console.log();
    console.log(result.correct ? "✓ Correct!" : " ✘ Not quite");
    console.log(`The false claim was [${result.correctIndex}]`);
    console.log(`Why: ${result.explanation}`);
    console.log(`Points earnend: ${result.pointsAwarded}`);
    console.log(`Total Score: ${session.getScore()}`);
}

main().catch(console.error);
