export interface QuestionResponse {
  category: string;
  correct_answer: boolean;
  difficulty: string;
  incorrect_answers: boolean[];
  question: string;
  type: string;
}
