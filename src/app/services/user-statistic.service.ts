import { UserStatisticLastQuiz } from './../types/UserStatisticLastQuiz';
import { Injectable } from '@angular/core';
import { UserStatisticTotal } from '../types/UserStatisticTotal';

@Injectable({
  providedIn: 'root',
})
export class UserStatisticService {
  private cacheTotalResult = 'userStatistic';
  private cacheLastResult = 'userLastResult';

  constructor() {}

  cacheStatisticTotal(newData: UserStatisticLastQuiz): void {
    const cachedData = this.getStatisticTotal();

    if (!cachedData) {
      localStorage.setItem(
        this.cacheTotalResult,
        JSON.stringify({ ...newData, passedQuizzes: [newData.categoryId] })
      );
      return;
    }

    const finishData: UserStatisticTotal = {
      passedQuizzes: [...cachedData.passedQuizzes, newData.categoryId],
      numberOfQuestion: cachedData.numberOfQuestion + newData.numberOfQuestion,
      numberOfCorrectAnswer:
        cachedData.numberOfQuestion + newData.numberOfCorrectAnswer,
      timeOfAnswering: cachedData.timeOfAnswering + newData.timeOfAnswering,
    };

    localStorage.setItem(this.cacheLastResult, JSON.stringify(newData));
    localStorage.setItem(this.cacheTotalResult, JSON.stringify(finishData));
  }

  cacheStatisticLast(newData: UserStatisticLastQuiz): void {
    localStorage.setItem(this.cacheLastResult, JSON.stringify(newData));
  }

  getStatisticTotal(): UserStatisticTotal {
    const cachedData = localStorage.getItem(this.cacheTotalResult);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  getStatisticLast(): UserStatisticLastQuiz {
    const cachedData = localStorage.getItem(this.cacheLastResult);
    return cachedData ? JSON.parse(cachedData) : null;
  }
}
