import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HeaderService } from './services/header.service';
import { CategoryStoreService } from './services/quiz-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public headerService: HeaderService,
    private _snackBar: MatSnackBar,
    public quizFromStorageService: CategoryStoreService,
    private router: Router
  ) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 2000,
    });
  }

  showNotification() {
    const isCurrentQuiz = this.quizFromStorageService.getCategory();

    if (!isCurrentQuiz) {
      this.openSnackBar("Let's choose a quiz", 'x');
    }
    return;
  }

  isActiveRoute(route: string): boolean {
    return this.router.isActive(route, true);
  }
}
