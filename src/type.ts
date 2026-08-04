export interface Statement {
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
 
    text: string;
    isTrue: boolean;
    explanation: string;
}


 // This is what the player should be seeing before they make the guess, or atleast thats what I hope T_T 
export interface PublicStatement {
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    text: string;
}

// what we hand back AFTER players makes a guess 
export interface AnswerResult {
    correct: boolean;
    actualAnswer: boolean;
    explanation: string;
    pointsAwarded: number;
}
