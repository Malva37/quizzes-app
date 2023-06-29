import { MatPaginator } from '@angular/material/paginator';
import { CategoryStoreService } from './../../services/quiz-store.service';
import { QuizzesService } from './../../services/quizzes.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/types/Category';
import { Router } from '@angular/router';
import { UserStatisticService } from 'src/app/services/user-statistic.service';
import { CategoryResponse } from 'src/app/types/CategoryResponse';
import { UserStatisticTotal } from 'src/app/types/UserStatisticTotal';
import { convertTime } from 'src/app/helper/convertTime';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isPassedQuiz: boolean = false;
  timeToDisplay: string = '';
  result: UserStatisticTotal = {
    passedQuizzes: [],
    numberOfCorrectAnswer: 0,
    numberOfQuestion: 0,
    timeOfAnswering: 0,
  };
  dataSource!: MatTableDataSource<Category>;
  displayedColumns = ['name', 'numberOfQuestions', 'play'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public quizzesFromServerService: QuizzesService,
    public cacheService: CategoryStoreService,
    public statisticService: UserStatisticService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fillResults();
    this.quizzesFromServerService.categories$.subscribe(
      (data: CategoryResponse[]) => {
        const categories = this.normalize(data);
        this.dataSource = new MatTableDataSource(this.normalize(categories));
        this.dataSource.paginator = this.paginator;
      }
    );
  }

  fillResults() {
    const cachedData = this.statisticService.getStatisticTotal();
    if (!cachedData) {
      this.isPassedQuiz = false;
      return;
    }

    this.isPassedQuiz = true;
    this.result = {
      passedQuizzes: cachedData.passedQuizzes,
      numberOfCorrectAnswer: cachedData.numberOfCorrectAnswer,
      numberOfQuestion: cachedData.numberOfQuestion,
      timeOfAnswering: cachedData.timeOfAnswering,
    };

    this.timeToDisplay = convertTime(this.result.timeOfAnswering);
  }

  normalize(data: CategoryResponse[]): Category[] {
    const cachedData = this.statisticService.getStatisticTotal();
    let passedQuizzesId: number[] = [];
    if (cachedData) {
      passedQuizzesId = cachedData.passedQuizzes;
    }

    const categories: Category[] = data.map((item) => ({
      ...item,
      passed: passedQuizzesId.includes(item.id),
    }));

    return categories;
  }

  chooseCategory(category: Category) {
    this.cacheService.cacheCategory(category);
    this.router.navigateByUrl('/play');
  }

  random() {
    const randomQuiz =
      this.dataSource.data[
        Math.floor(this.dataSource.data.length * Math.random())
      ];

    this.cacheService.cacheCategory(randomQuiz);
    this.router.navigateByUrl('/play');
  }

  calculatePercentage() {
    const percentage =
      (this.result.numberOfCorrectAnswer / this.result.numberOfQuestion) *
      100;
      
    return `${percentage.toFixed(2)}%`;
  }
}
