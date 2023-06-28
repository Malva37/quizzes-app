import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { convertTime } from 'src/app/helper/convertTime';
import { UserStatisticService } from 'src/app/services/user-statistic.service';
import { UserStatisticLastQuiz } from 'src/app/types/UserStatisticLastQuiz';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss']
})
export class FinishComponent implements OnInit {
  results: UserStatisticLastQuiz  = {
    categoryId: 0,
    categoryName: '',
    numberOfCorrectAnswer: 0,
    numberOfQuestion: 10,
    timeOfAnswering: 0,
  }
  timeToDisplay: string = '0:00:00';
  isPassedQuiz: boolean = false;

 constructor(
  public statisticService: UserStatisticService,
  private router: Router,
 ) {}

  ngOnInit(): void {
    this.fillResults();
  }

  fillResults() {
    const cachedData = this.statisticService.getStatisticLast();

    if (!cachedData) {
      this.isPassedQuiz = false;
      return;
    }

    this.isPassedQuiz = true;

    this.results = {
      categoryId: cachedData.categoryId,
      categoryName: cachedData.categoryName,
      numberOfCorrectAnswer: cachedData.numberOfCorrectAnswer,
      numberOfQuestion: cachedData.numberOfQuestion,
      timeOfAnswering: cachedData.timeOfAnswering,
    };

    this.timeToDisplay = convertTime(this.results.timeOfAnswering);
  }

  calculatePercentage() {
    const percentage = (this.results.numberOfCorrectAnswer / this.results.numberOfQuestion) * 100;
    return `${percentage.toFixed(2)}%`;
  }
  
  navigateHome() {
    this.router.navigateByUrl('/home');
  }
}
