# Hallucination Hunter (WIP)




## Quick start (from a fresh clone)

**1. Install [Node.js](https://nodejs.org/) (v18 or newer)** if you don't already have it.
Check with:
```
node -v
```

**2. Clone the repo and install dependencies**
```
git clone https://github.com/13-HH/hallucination-temp
cd hallucination-hunter
npm install
```

**3. Get a free Groq API key**

This project currently uses [Groq](https://console.groq.com) to generate
statements which is a free.

- Go to https://console.groq.com/keys
- Sign up / log in
- Click **"Create API Key"**
- Copy the key 

**4. Set up the environment file**

Update a file named `.env` in the project root with your key (Don't worry, it doesn't hold any of our secrets :)
```
GROQ_API_KEY=your_key_here
```

**5. Run the server**
```
npm run server
```

**6. Open the game**

Go to **http://localhost:3000** in your browser. You should see a
statement load, with buttons to guess True or False, followed by
feedback and a running score.

---

## What's actually happening under the hood

1. The server asks an LLM (Groq, running an llama3 70b) to
   generate one short factual statement, and to decide for itself
   whether that statement is true or false.
2. The player only ever sees the statement text and never the answer,
   until they've committed to a guess.
3. The server checks the guess against the LLM's own answer, scores it,
   and returns an explanation.

**Important:** the LLM is *not* being told to lie or trick the player.
It's asked to state something and honestly label whether it's true.
Sometimes it's simply wrong, or even contradicts its own explanation —
that's a real, unscripted hallucination happening live.

---


## Available scripts

| Command | What it does |
|---|---|
| `npm run server` | Starts the web server |
| `npm run dev` | Runs the old CLI version - play one round in the terminal |


---

## Swapping to a different LLM provider

Every provider implements the same interface
(`generate(systemPrompt, userPrompt): Promise<string>`), so switching
is just changing one line. In `src/server.ts` plus updating the .env:

```ts
// Currently:
import { GroqProvider } from "./llm/groq";
const llm = new GroqProvider(process.env.GROQ_API_KEY!, process.env.GROQ_MODEL);

// To use Gemini instead:
import { GeminiProvider } from "./llm/gemini";
const llm = new GeminiProvider(process.env.GEMINI_API_KEY!, process.env.GEMINI_MODEL);

// To use a local model via Ollama instead (needs `ollama serve` running):
import { OllamaProvider } from "./llm/ollama";
const llm = new OllamaProvider(process.env.OLLAMA_MODEL, process.env.OLLAMA_BASE_URL);
```
Nothing else in the codebase needs to change

---

### `.env` variables needed per provider
 
| Provider | `.env` variables | Get a key from |
|---|---|---|
| Groq (current default) | `GROQ_API_KEY`, `GROQ_MODEL` | https://console.groq.com/keys |
| Gemini | `GEMINI_API_KEY`, `GEMINI_MODEL` | https://aistudio.google.com/apikey |
| Ollama | `OLLAMA_BASE_URL`, `OLLAMA_MODEL` | No key needed, but requires Ollama installed + `ollama serve` running locally |
 
 
---

## Known limitations (being worked on)

- The LLM sometimes hallucinates or contradicts its own explanation -
  expected, but means generated statements aren't 100% reliable yet.
  A verification step (fact-checking against a real source, e.g.
  Wikipedia) is planned but not yet built.
- No difficulty based topic variety yet.
- Free-tier API rate limits apply.