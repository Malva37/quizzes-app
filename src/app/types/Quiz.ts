import { Question } from "./Question";

export interface Quiz {
  categoryId: number;
  categoryName: string;
  questions: Question[];
}
