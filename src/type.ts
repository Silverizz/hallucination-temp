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