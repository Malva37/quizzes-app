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

    // or you last quiz is the same what had already done

    if (condition) {
      if (condition.passed) {
        return this.router.parseUrl('/');
      }
      return true;
    } else {
      return this.router.parseUrl('/');
    }
  }
}
