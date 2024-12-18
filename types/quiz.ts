export type QuestionType = 'text' | 'date' | 'number' | 'dropdown' | 'multiselect';

export interface Option {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
  subQuestion?: Question;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, { value: string | string[] | number | Date }>;
  attemptId: string;
  attemptNumber: number;
  startTime: number;
  class?: string;
  schoolName?: string;
  guidanceCenter?: string;
}

export interface QuizProps {
  questions: Question[];
}

