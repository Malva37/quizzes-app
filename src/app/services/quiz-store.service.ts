import { Quiz } from './../types/Quiz';
import { Injectable } from '@angular/core';
import { Category } from '../types/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryStoreService {
  private cacheKey = 'currentCategory';

  constructor() {}

  cacheCategory(category: Category): void {
    localStorage.setItem(this.cacheKey, JSON.stringify(category));
  }

  getCategory(): Category {
    const cachedData = localStorage.getItem(this.cacheKey);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }
}
