import "dotenv/config";
import { OllamaProvider } from "./llm/ollama";
import { ScenarioGenerator } from "./services/ScenarioGenerator";

async function main() {
    const llm = new OllamaProvider(
        process.env.OLLAMA_MODEL,
        process.env.OLLAMA_BASE_URL
    );

    const generator = new ScenarioGenerator(llm);

    const scenario = await generator.generate("History", "Medium");

    console.log(scenario);
}

main().catch(console.error);