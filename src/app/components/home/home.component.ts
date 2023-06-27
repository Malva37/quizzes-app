import { Quiz } from './../../types/Quiz';
import { MatPaginator } from '@angular/material/paginator';
import { CategoryStoreService } from './../../services/quiz-store.service';
import { QuizzesService } from './../../services/quizzes.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/types/Category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dataSource!: MatTableDataSource<Category>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['name', 'numberOfQuestions', 'play'];

  constructor(
    public quizzesFromServerService: QuizzesService,
    public cacheService: CategoryStoreService,
    private router: Router
  ) {}

  // ngAfterViewInit(): void {
  //     this.dataSource.paginator = this.paginator;
  // }

  ngOnInit(): void {
    this.quizzesFromServerService.categories$.subscribe(
      (categories: Category[]) => {
        this.dataSource = new MatTableDataSource(categories);
        this.dataSource.paginator = this.paginator;
      }
    );
  }

  chooseCategory(category: Category) {
    console.log(category);

    this.cacheService.cacheCategory(category);
    this.router.navigateByUrl('/play');
  }

  random() {
    const randomQuiz =  this.dataSource.data[Math.floor(this.dataSource.data.length * Math.random())];

    this.cacheService.cacheCategory(randomQuiz);
    this.router.navigateByUrl('/play');
  }
}
