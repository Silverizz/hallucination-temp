export interface Scenario {
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
  
    question: string;
  
    response: string;
  
    claims: {
      text: string;
      truth: boolean;
      explanation?: string;
    }[];
  }



 // This is what the player should be seeing before they make the guess, or atleast thats what I hope T_T 
export interface PublicClaim {
    index: number;
    text: string;
}

// what we hand back AFTER players makes a guess 
export interface AnswerResult {
    correct: boolean;
    correctIndex: number;
    explanation: string;
    pointsAwarded: number;
}
