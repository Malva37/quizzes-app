import { Question } from './../types/Question';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../types/Quiz';
import { Category } from '../types/Category';
import { CategoryStoreService } from './quiz-store.service';
import { QuestionResponse } from '../types/QuestionResponse';

const BASE_URL = 'https://opentdb.com';

@Injectable({
  providedIn: 'root',
})
export class QuizzesService {
  refresh$$ = new BehaviorSubject(null);
  categories$: Observable<Category[]>;

  constructor(
    private http: HttpClient,
    private cacheService: CategoryStoreService
  ) {
    this.categories$ = this.refresh$$.pipe(
      switchMap(() => this.getCategories())
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<{ trivia_categories: Category[] }>(`${BASE_URL}/api_category.php`)
      .pipe(map((response) => response.trivia_categories));
  }

  getOneQuiz() {
    const currentQuiz = this.cacheService.getCategory();
    return this.http.get<{ results: QuestionResponse[] }>(
      `${BASE_URL}/api.php?amount=10&category=${currentQuiz.id}&type=boolean`
    );
    // .pipe(tap(() => this.refresh$$.next(null)));
  }
}