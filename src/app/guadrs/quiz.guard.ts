import { Injectable } from '@angular/core';
import { CanActivate,  UrlTree, Router } from '@angular/router';
import { CategoryStoreService } from '../services/quiz-store.service';

@Injectable({
  providedIn: 'root'
})
export class QuizGuard implements CanActivate {
  constructor(
    private router: Router,
    public cacheService: CategoryStoreService,
    ) {}

  canActivate(): boolean | UrlTree {
    const condition = this.cacheService.getCategory();

    // JSON.parse(
    //   localStorage.getItem('currentCategory') || 'false');

    if (condition) {
      return true;
    } else {
      return this.router.parseUrl('/');
    }
  }
}
