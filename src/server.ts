import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { Gemini } from "./llm/gemini";
import { Groq } from "./llm/groq";
import { StatementGenerator } from "./services/StatementGenerator";
import { GameSession } from "./services/GameLogic";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const llm = new Groq(process.env.GROQ_API_KEY!, process.env.GROQ_MODEL);
const generator = new StatementGenerator(llm);

//sessionId
const sessions = new Map<string, GameSession>();
const playerScores = new Map<string, number>();

// generates a new statement, returns the safe public version (no answer) plus a sessionId the browser must send back when it submits a guess
app.get("/api/statement", async (req, res) => {
    try {
        const topic = (req.query.topic as string);
        const difficulty = (req.query.difficulty as "Easy" | "Medium" | "Hard");

        const statement = await generator.generate(topic, difficulty);
        const session = new GameSession(statement);

        const sessionId = randomUUID();
        sessions.set(sessionId, session);

        res.json({
            sessionId,
            statement: session.getPublicStatement(),
        });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate a statement" });
    }
});


// Looks up the matching GameSession and scores the guess server-side, then adds the points to that player's running total
app.post("/api/answer", (req, res) => {
    const { sessionId, playerId, guess } = req.body;

    const session = sessions.get(sessionId);
    if (!session) {
        return res.status(404).json({error: "Unknown or expired sessionId — request a new statement first",});
    }

    try {
        const result = session.submitAnswer(guess);

        const previousScore = playerScores.get(playerId) ?? 0;
        const newScore = previousScore + result.pointsAwarded;
        playerScores.set(playerId, newScore);

        res.json({ ...result, totalScore: newScore });
    } 
    catch (err: any) {
        res.status(400).json({ error: err.message });
    } 
    finally {
        sessions.delete(sessionId);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});