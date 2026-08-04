import { gunzipSync } from "zlib";
import { Scenario, PublicClaim, AnswerResult } from "../type";

const POINTS_PER_CORRECT_ANSWER = 10;

export class GameSession {
    private answered = false;
    private score = 0;

    constructor(private scenario: Scenario) {
        this.assertExactlyOneFalseClaim();
    }

    private assertExactlyOneFalseClaim() {
        const falseClaims = this.scenario.claims.filter((c) => !c.truth);
        if (falseClaims.length !== 1) {
            throw new Error ('GameSession requires exactly one false claim, got ${falseClaims.length}');
        }
    }

    getQuestion(): string {
        return this.scenario.question;
    }

    getResponseText(): string {
        return this.scenario.response;
    }

    //send this to front end (shows no answers in it)
    getPublicClaims(): PublicClaim[] {
        return this.scenario.claims.map((claim, index) => ({index, text: claim.text}));
    }

    getScore(): number {
        return this.score;
    }


    // Players guessing which claim (by index) is false. Returning if they were right or not, the correct index, the explanation, and the points earned 
    submitAnswer(guessedIndex: number): AnswerResult {
        if (this.answered) {
            throw new Error ('This scenario has already been answered, start a new session for another attempt');
        }

        if (guessedIndex < 0 || guessedIndex >= this.scenario.claims.length) {
            throw new Error ('gussedIndex ${guessedIndex} is out of range')
        }

        this.answered = true;

        const correctIndex = this.scenario.claims.findIndex((c) => !c.truth);
        const correct = guessedIndex === correctIndex;
        const pointsAwarded = correct ? POINTS_PER_CORRECT_ANSWER : 0;

        this.score += pointsAwarded;

        return {
            correct,
            correctIndex,
            explanation:
                this.scenario.claims[correctIndex].explanation ??
                "No explanation was provided for this claim.",
            pointsAwarded,
        };
    }
}