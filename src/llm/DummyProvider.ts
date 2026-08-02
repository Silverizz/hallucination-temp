import { LLMProvider } from "./LLMProvider";

export class DummyProvider implements LLMProvider {
    async generate(prompt: string): Promise<string> {
        return JSON.stringify({
            topic: "History",
            difficulty: "Medium",
            question: "Who built Machu Picchu, and what do we know about it?",
            response:
                "Machu Picchu was built by the Inca in the 15th century, likely as a royal estate for Emperor Pachacuti. It sits in the Andes at roughly 2,430 metres above sea level. It was constructed using large blocks of granite cut so precisely that no mortar was needed. Spanish conquistadors discovered and looted the site shortly after building it, which is why it remains so well preserved today.",
            claims: [
                {
                    text: "Machu Picchu was built by the Inca in the 15th century, likely as a royal estate for Emperor Pachacuti.",
                    truth: true
                },
                {
                    text: "It sits in the Andes at roughly 2,430 metres above sea level.",
                    truth: true
                },
                {
                    text: "It was constructed using large blocks of granite cut so precisely that no mortar was needed.",
                    truth: true
                },
                {
                    text: "Spanish conquistadors discovered and looted the site shortly after building it, which is why it remains so well preserved today.",
                    truth: false,
                    explanation:
                        "The Spanish never actually found Machu Picchu — that's precisely why it survived so intact. It stayed unknown to the outside world until Hiram Bingham's 1911 expedition. This claim quietly contradicts itself (if it was looted, why would it be well preserved?) and is a good example of a subtle, confidently-stated fabrication."
                }
            ]
        }, null, 2);
    }
}