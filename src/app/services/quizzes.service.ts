import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../types/Category';
import { CategoryStoreService } from './quiz-store.service';
import { QuestionResponse } from '../types/QuestionResponse';
import { CategoryResponse } from '../types/CategoryResponse';

const BASE_URL = 'https://opentdb.com';

@Injectable({
  providedIn: 'root',
})
export class QuizzesService {
  refresh$$ = new BehaviorSubject(null);
  categories$: Observable<CategoryResponse[]>;

  constructor(
    private http: HttpClient,
    private cacheService: CategoryStoreService
  ) {
    this.categories$ = this.refresh$$.pipe(
      switchMap(() => this.getCategories())
    );
  }

  getCategories(): Observable<CategoryResponse[]> {
    return this.http
      .get<{ trivia_categories: Category[] }>(`${BASE_URL}/api_category.php`)
      .pipe(map((response) => response.trivia_categories));
  }

  getOneQuiz() {
    const currentQuiz = this.cacheService.getCategory();

    return this.http.get<{ results: QuestionResponse[] }>(
      `${BASE_URL}/api.php?amount=10&category=${currentQuiz.id}&type=boolean`);
  }
}
