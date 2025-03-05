
export type Difficulty = 'easy' | 'medium' | 'hard';

export type Topic = 
  | 'React Hooks'
  | 'State Management'
  | 'Components'
  | 'Props'
  | 'JSX'
  | 'Context API'
  | 'Event Handling'
  | 'Lifecycle Methods'
  | 'Performance'
  | 'Rendering';

export interface TestCase {
  id: string;
  description: string;
  expectedOutput: string | number | boolean | object | null;
  testFunction: (code: string) => boolean;
}

export interface Hint {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  topics: Topic[];
  averageTimeMin: number;
  starterCode: string;
  testCases: TestCase[];
  hints: Hint[];
  solution: string;
}

export interface UserProgress {
  questionId: string;
  completed: boolean;
  timeSpentMs: number;
  lastAttemptDate: string;
  passedTestCases: string[]; // TestCase IDs
}
