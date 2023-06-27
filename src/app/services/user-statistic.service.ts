import { Injectable } from '@angular/core';
import { UserStatistic } from '../types/UserStatistic';

@Injectable({
  providedIn: 'root',
})
export class UserStatisticService {
  private cacheKey = 'userStatistic';

  constructor() {}

  cacheStatistic(newData: UserStatistic): void {
    const cachedData = this.getStatistic();

    if (!cachedData) {
      localStorage.setItem(
        this.cacheKey,
        JSON.stringify({ ...newData, numberOfQuizzes: 1 })
      );
      return;
    }

    const finishData: UserStatistic = {
      numberOfQuizzes: cachedData.numberOfQuizzes++,
      numberOfQuestion: cachedData.numberOfQuestion + newData.numberOfQuestion,
      numberOfCorrectAnswer:
        cachedData.numberOfQuestion + newData.numberOfCorrectAnswer,
      timeOfAnswering: cachedData.timeOfAnswering + newData.timeOfAnswering,
    };

    localStorage.setItem(this.cacheKey, JSON.stringify(finishData));
  }

  getStatistic(): UserStatistic {
    const cachedData = localStorage.getItem(this.cacheKey);
    return cachedData ? JSON.parse(cachedData) : null;
  }
}
