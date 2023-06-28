import { QuestionResponse } from './../../types/QuestionResponse';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryStoreService } from 'src/app/services/quiz-store.service';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { Quiz } from 'src/app/types/Quiz';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStatisticService } from 'src/app/services/user-statistic.service';
import { convertTime } from 'src/app/helper/convertTime';
import { UserStatisticLastQuiz } from 'src/app/types/UserStatisticLastQuiz';

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

  userResult: UserStatisticLastQuiz = {
    categoryId: 0,
    categoryName: '',
    numberOfCorrectAnswer: 0,
    numberOfQuestion: 0,
    timeOfAnswering: 0,
  };

  constructor(
    public quizzesFromServerService: QuizzesService,
    public cacheService: CategoryStoreService,
    public statisticService: UserStatisticService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.startTimer();
    this.getCurrentQuiz();
    this.fillCurrentQuiz();
    this.quizForm = this.fb.group({
      answer: [null, Validators.required],
    });
  }

  startTimer() {
    this.timerId = setInterval(() => {
      this.timer++;
      this.timerDisplay = convertTime(this.timer);
    }, 1000);
  }

  fillCurrentQuiz() {
    const quizFromStorage = this.cacheService.getCategory();
    console.log(quizFromStorage);

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
    this.cacheService.clearCache();
    this.userResult = {
      categoryId: 0,
      categoryName: '',
      numberOfCorrectAnswer: 0,
      numberOfQuestion: 0,
      timeOfAnswering: 0,
    };
    clearInterval(this.timerId);
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
    if (this.quizForm.valid) {
      this.currentQuiz.questions[this.currentQuestionIndex].userAnswer =
        this.quizForm.value.answer;
      clearInterval(this.timerId);
      this.quizForm.reset();
      this.calculateResults();
      this.statisticService.cacheStatisticTotal(this.userResult);
      this.statisticService.cacheStatisticLast(this.userResult);
      this.router.navigateByUrl('/finish');
    }
  }

  calculateResults() {
    const numberOfCorrectAnswer = this.currentQuiz.questions.filter(
      (question) => question.correctAnswer === question.userAnswer
    );
    const timeOfAnswering = this.timer;

    this.userResult = {
      categoryId: this.currentQuiz.categoryId,
      categoryName: this.currentQuiz.categoryName,
      numberOfCorrectAnswer: numberOfCorrectAnswer.length,
      numberOfQuestion: this.currentQuiz.questions.length,
      timeOfAnswering,
    };
  }
}
