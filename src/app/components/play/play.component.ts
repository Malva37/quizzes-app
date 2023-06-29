import { QuestionResponse } from './../../types/QuestionResponse';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryStoreService } from 'src/app/services/quiz-store.service';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { Quiz } from 'src/app/types/Quiz';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStatisticService } from 'src/app/services/user-statistic.service';
import { convertTime } from 'src/app/helper/convertTime';
import { UserStatisticLastQuiz } from 'src/app/types/UserStatisticLastQuiz';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  isLastQuestion: boolean = false;
  timer: number = 0;
  timerId!: ReturnType<typeof setInterval>;
  timerDisplay: string = '';
  quizForm!: FormGroup;
  currentQuestionIndex: number = 0;
  currentQuiz: Quiz = {
    categoryId: 0,
    categoryName: '',
    questions: [],
  };
  currentResult: UserStatisticLastQuiz = {
    categoryId: 0,
    categoryName: '',
    numberOfCorrectAnswer: 0,
    numberOfQuestion: 0,
    timeOfAnswering: 0,
  };

  constructor(
    private cdr: ChangeDetectorRef,
    public headerService: HeaderService,
    public quizzesFromServerService: QuizzesService,
    public categoryService: CategoryStoreService,
    public statisticService: UserStatisticService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      answer: [null, Validators.required],
    });
    this.fillCurrentQuiz();
    this.getCurrentQuiz();
    this.startTimer();

    setTimeout(() => {
      this.headerService.setHeaderEnabled(false);
      this.cdr.detectChanges();
    }, 0);
  }

  startTimer() {
    this.timerId = setInterval(() => {
      this.timer++;
      this.timerDisplay = convertTime(this.timer);
    }, 1000);
  }

  fillCurrentQuiz() {
    const quizFromStorage = this.categoryService.getCategory();

    if (quizFromStorage) {
      this.currentQuiz.categoryId = quizFromStorage.id;
      this.currentQuiz.categoryName = quizFromStorage.name;
    }
  }

  getCurrentQuiz() {
    this.quizzesFromServerService.getOneQuiz().subscribe((data) => {
      this.currentQuiz.questions = this.normalize(data.results);
    });
  }

  normalize(data: QuestionResponse[]) {
    return data.map((item) => ({
      question: item.question,
      correctAnswer: item.correct_answer,
      userAnswer: null,
    }));
  }

  cancel() {
    this.categoryService.clearCache();
    this.currentResult = {
      categoryId: 0,
      categoryName: '',
      numberOfCorrectAnswer: 0,
      numberOfQuestion: 0,
      timeOfAnswering: 0,
    };
    clearInterval(this.timerId);
    this.headerService.setHeaderEnabled(true);
    this.router.navigateByUrl('/home');
  }

  nextQuestion() {
    if (this.quizForm.valid) {
      this.currentQuiz.questions[this.currentQuestionIndex].userAnswer =
        this.quizForm.value.answer;
      this.quizForm.reset();
      this.currentQuestionIndex++;

      if (this.currentQuestionIndex === this.currentQuiz.questions.length - 1) {
        this.isLastQuestion = true;
      }
    }
  }

  finishQuiz() {
    this.currentQuiz.questions[this.currentQuestionIndex].userAnswer =
      this.quizForm.value.answer;
    clearInterval(this.timerId);
    this.quizForm.reset();
    this.calculateResults();
    this.statisticService.cacheStatisticTotal(this.currentResult);
    this.statisticService.cacheStatisticLast(this.currentResult);
    this.headerService.setHeaderEnabled(true);
    this.router.navigateByUrl('/finish');
    this.categoryService.clearCache();
  }

  calculateResults() {
    const numberOfCorrectAnswer = this.currentQuiz.questions.filter(
      (question) => question.correctAnswer === question.userAnswer
    );

    this.currentResult = {
      categoryId: this.currentQuiz.categoryId,
      categoryName: this.currentQuiz.categoryName,
      numberOfCorrectAnswer: numberOfCorrectAnswer.length,
      numberOfQuestion: this.currentQuiz.questions.length,
      timeOfAnswering: this.timer,
    };
  }
}
