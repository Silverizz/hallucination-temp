import { Statement, PublicStatement, AnswerResult } from "../type";

const POINTS_PER_CORRECT_ANSWER = 10;

export class GameSession {
    private answered = false;
    private score = 0;

    constructor(private statement: Statement) {}

    getPublicStatement(): PublicStatement {
        return {topic: this.statement.topic, difficulty: this.statement.difficulty, text: this.statement.text,};
    }

    getScore(): number {
        return this.score;
    }

  
    //Player guesses the answer, returns right or wrong
    submitAnswer(guess: boolean): AnswerResult {
        if (this.answered) {
            throw new Error("This statement has already been answered, start a new GameSession for another attempt.");
        }

        this.answered = true;

        const correct = guess === this.statement.isTrue;
        const pointsAwarded = correct ? POINTS_PER_CORRECT_ANSWER : 0;

        this.score += pointsAwarded;

        return {
            correct,
            actualAnswer: this.statement.isTrue,
            explanation: this.statement.explanation,
            pointsAwarded,
        };
    }
}