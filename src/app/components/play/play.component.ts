import { QuestionResponse } from './../../types/QuestionResponse';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryStoreService } from 'src/app/services/quiz-store.service';
import { QuizzesService } from 'src/app/services/quizzes.service';
import { Question } from 'src/app/types/Question';
import { Quiz } from 'src/app/types/Quiz';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStatisticService } from 'src/app/services/user-statistic.service';
import { UserStatistic } from 'src/app/types/UserStatistic';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  isLastQuestion: boolean = false;

  quizForm!: FormGroup;
  currentQuestionIndex: number = 0;
  currentQuiz: Quiz = {
    categoryId: 0,
    categoryName: '',
    questions: [],
  };

  userResult: UserStatistic = {
    numberOfQuizzes: 0,
    numberOfCorrectAnswer: 0,
    numberOfQuestion: 0,
    timeOfAnswering: 0,
  };

  constructor(
    public quizzesFromServerService: QuizzesService,
    public cacheService: CategoryStoreService,
    public statisticService: UserStatisticService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getCurrentQuiz();
    this.fillCurrentQuiz();
    this.quizForm = this.fb.group({
      answer: [null, Validators.required]
    });
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
    this.quizzesFromServerService.getOneQuiz().subscribe(
      (data) => {
      console.log(data);


      this.currentQuiz.questions = this.normalize(data.results);
    });
    console.log(this.currentQuiz);

  }

  normalize (data: QuestionResponse[]) {
    console.log(data);

    return data.map(item => ({
      question: item.question,
      correctAnswer: item.correct_answer,
      userAnswer: null,
    }))
  }

  cancel() {
    this.cacheService.clearCache();
    this.userResult = {
      numberOfQuizzes: 0,
      numberOfCorrectAnswer: 0,
      numberOfQuestion: 0,
      timeOfAnswering: 0,
    }
    this.router.navigateByUrl('/home');
  }

  nextQuestion() {
    if (this.quizForm.valid) {
      this.currentQuiz.questions[this.currentQuestionIndex].userAnswer = this.quizForm.value.answer;
      this.quizForm.reset();
      this.currentQuestionIndex++;

      if (this.currentQuestionIndex === this.currentQuiz.questions.length - 1) {
      this.isLastQuestion = true;
      }
      console.log(this.currentQuestionIndex);
    }

    // if (this.isLastQuestion()) {
    //   this.currentQuiz.questions[this.currentQuestionIndex].userAnswer = this.quizForm.value.answer;
    //   this.calculateResults();

    //   this.statisticService.cacheStatistic(this.userResult)
    // }
  }

  finishQuiz() {
    if (this.quizForm.valid) {
      this.currentQuiz.questions[this.currentQuestionIndex].userAnswer = this.quizForm.value.answer;
      this.quizForm.reset();
      this.calculateResults();

      this.statisticService.cacheStatistic(this.userResult);
      this.router.navigateByUrl('/finish');
  }

  }


  // isLastQuestion() {
  //   console.log(this.currentQuestionIndex, 'his.currentQuestionIndex');
  //   console.log(this.currentQuiz.questions.length);


  //   return this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
  // }

  calculateResults() {
    const numberOfCorrectAnswer = this.currentQuiz.questions.filter(question => question.correctAnswer === question.userAnswer);
    const timeOfAnswering =100;
    console.log(this.currentQuiz.questions, 'this.currentQuiz.questions');
    console.log(numberOfCorrectAnswer);



    this.userResult = {
      numberOfCorrectAnswer: numberOfCorrectAnswer.length,
      numberOfQuizzes: 1,
      numberOfQuestion: this.currentQuiz.questions.length,
      timeOfAnswering
    };
  }

}
