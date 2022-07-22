import quizInfo from './quiz-info';
import { navigate } from './navigation';
import { QuestionCard } from './question-card';

export class QuizQuestions {
  init(params) {
    this.savedSettings = JSON.parse(localStorage.getItem('settings')) ?? {};
    this.generateLayout(params);
    this.bootstrapGame(params);
  }

  destroy(result) {
    if (!result) {
      this.QuizQuestionsPage.remove();
    } else {
      this.questionResultWrapper.remove();
      this.overlay.remove();
    }
    clearInterval(this.timerInterval);
  }

  generateLayout(params) {
    this.application = document.querySelector('.application');
    this.QuizQuestionsPage = document.createElement('div');
    this.QuizQuestionsPage.innerHTML = `  <section class="questions">
                                            <div class="container">
                                                <header class="header">
                                                    <div class="header__logo"></div>
                                                </header>
                                                <div class="questions__controls">
                                                    <button class="btn questions__btn-home">Home</button>
                                                    ${
                                                      this.savedSettings.timerToggle
                                                        ? `<div class="timer">
                                                          <img class="timer__image" src="./assets/svg/timer.svg" alt="timer">
                                                          <div class="timer__left"></div>
                                                        </div>`
                                                        : ''
                                                    }
                                                    <button class="btn questions__btn-categ">Categories</button>
                                            </div>
                                                <div class="questions__wrapper"></div>
                                                <div class="questions__indicators"></div>
                                            </div>
                                          </section>`;
    this.application.append(this.QuizQuestionsPage);
    this.homeButton = document.querySelector('.questions__btn-home');
    this.questionsWrapper = document.querySelector('.questions__wrapper');
    this.categoriesBtn = document.querySelector('.questions__btn-categ');

    this.homeButton.addEventListener('click', () => {
      navigate('mainPage', 'quizQuestions');
    });
    this.categoriesBtn.addEventListener('click', () => {
      navigate('quizCategoriesMenu', 'quizQuestions', { questionType: params.questionType });
    });
  }

  bootstrapGame(params) {
    const onAnswerSelected = (isCorrect) => {
      this.answers[this.currentQuestion] = isCorrect;
      this.addQuestionResult(isCorrect, params, onAnswerSelected);
    };

    this.answers = {};
    this.pictureCounter = (params.cardNumber - 1) * 10;
    this.lastQuestionNumber = this.pictureCounter + 9;
    this.currentQuestion = this.pictureCounter;
    this.questionCard = new QuestionCard();
    this.questionCard.generateQuestion({
      ...params,
      currentQuestion: this.currentQuestion,
      onAnswerSelected: onAnswerSelected,
      containerClass: '.questions__wrapper',
    });
    this.enableQuestionTimer(params, onAnswerSelected);
  }

  addQuestionResult(isCorrect, params, onAnswerSelected) {
    clearInterval(this.timerInterval);
    const questionResultWrapper = document.createElement('div');
    this.questionResultWrapper = questionResultWrapper;
    questionResultWrapper.classList.add('answer-modal', 'active');
    questionResultWrapper.innerHTML = `<div class="answer-modal__wrapper">
                                                <div class="answer-modal__iscorrect">${
                                                  isCorrect ? 'CORRECT!' : 'INCORRECT!'
                                                }</div>
                                                <div class="answer-modal__picture">
                                                    <img src="assets/pictures/${
                                                      this.currentQuestion
                                                    }.jpg" alt="picture">
                                                </div>
                                                <div class="answer-modal__name">${
                                                  quizInfo[this.currentQuestion].name
                                                }</div>
                                                <div class="answer-modal__author">${
                                                  quizInfo[this.currentQuestion].author
                                                }</div>
                                                <div class="answer-modal__year">${
                                                  quizInfo[this.currentQuestion].year
                                                }</div>
                                                <div class="btn answer-modal__btn">Next</div>
                                            </div>`;
    this.application.append(questionResultWrapper);
    this.nextBtn = document.querySelector('.answer-modal__btn');

    if (this.currentQuestion === this.lastQuestionNumber) {
      this.nextBtn.addEventListener('click', () => {
        this.finishCurrentGame(params, questionResultWrapper);
      });
    } else {
      this.nextBtn.addEventListener('click', () => {
        this.currentQuestion++;
        this.questionCard.generateQuestion({
          questionType: params.questionType,
          currentQuestion: this.currentQuestion,
          onAnswerSelected: onAnswerSelected,
          containerClass: '.questions__wrapper',
        });
        this.destroy('result');
        this.enableQuestionTimer(params, onAnswerSelected);
      });
    }

    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');
    this.application.append(this.overlay);
  }

  getGameResultModal(correctAnswerCounter) {
    return `<div class="result-modal">
              <div class="result-modal__text">Your score is</div>
              <div class="result-modal__score">${correctAnswerCounter} / 10</div>
              <button class="btn result-modal__btn result-modal__home">Home</button>
              <button class="btn result-modal__btn result-modal__next">Next Quiz</button>
          </div>`;
  }

  calculateGameScore() {
    const correctAnswerCounter = Object.values(this.answers).reduce((acc, val) => {
      if (val) {
        acc++;
      }

      return acc;
    }, 0);

    return correctAnswerCounter;
  }

  saveGameResults(correctAnswerCounter, params) {
    let gamesResults = JSON.parse(localStorage.getItem('gamesResults'));

    if (!gamesResults) {
      gamesResults = {};
    }

    gamesResults[`${params.cardNumber}${params.questionType}`] = {
      questionResults: this.answers,
      score: correctAnswerCounter,
    };

    localStorage.setItem('gamesResults', JSON.stringify(gamesResults));
  }

  finishCurrentGame(params, questionResultWrapper) {
    const correctAnswerCounter = this.calculateGameScore();
    this.saveGameResults(correctAnswerCounter, params);
    questionResultWrapper.innerHTML = this.getGameResultModal(correctAnswerCounter);
    this.application.append(questionResultWrapper);

    this.homeBtn = document.querySelector('.result-modal__home');
    this.nextQuizBtn = document.querySelector('.result-modal__next');

    this.homeBtn.addEventListener('click', () => {
      navigate('mainPage', 'quizQuestions');
      this.destroy('result');
    });

    this.nextQuizBtn.addEventListener('click', () => {
      navigate('quizCategoriesMenu', 'quizQuestions', { questionType: params.questionType });
      this.destroy('result');
    });
  }

  enableQuestionTimer(params, onAnswerSelected) {
    this.startTimer(() => {
      if (this.currentQuestion !== this.lastQuestionNumber) {
        this.addQuestionResult(false, params, onAnswerSelected);
      }
    });
  }

  startTimer(onTimerFinished) {
    if (this.savedSettings.timerToggle) {
      const timerValueElement = document.querySelector('.timer__left');
      let timeLeft = this.savedSettings.timerValue;
      timerValueElement.innerHTML = timeLeft;

      this.timerInterval = setInterval(() => {
        if (timeLeft === 0) {
          clearInterval(this.timerInterval);
          onTimerFinished();
        }

        timeLeft--;
        timerValueElement.innerHTML = timeLeft;
      }, 1000);
    }
  }
}
