import quizInfo from './quiz-info';

export class QuestionCard {
  constructor() {
    this.firstQuestion = true;
  }

  generateQuestion(params) {
    if (!this.firstQuestion) {
      this.destroy();
    } else {
      this.firstQuestion = false;
    }

    this.createQuizQuestions(params);
  }

  destroy() {
    this.quizTaskDescription.remove();

    if (this.picture) {
      this.picture.remove();
    }

    if (this.pictures) {
      this.pictures.remove();
    }

    if (this.answerOptions) {
      this.answerOptions.remove();
    }
  }

  createQuizQuestions(params) {
    this.application = document.querySelector('.application');
    this.questionsWrapper = document.querySelector(params.containerClass);
    this.quizTaskDescription = document.createElement('div');
    this.quizTaskDescription.classList.add('questions__question');
    this.questionsWrapper.append(this.quizTaskDescription);

    if(params.questionType === 'artists') {
      this.getArtistQuestion(params);
    } else {
      this.getPictureQuestion(params);
    }

    this.correctAnswer = document.querySelector('.correct');

    this.correctAnswer.addEventListener('click', () => {
      params.onAnswerSelected(true);
    });

    this.incorrectAnswers = document.querySelectorAll('.incorrect');

    for (let i = 0; i < this.incorrectAnswers.length; i++) {
      this.incorrectAnswers[i].addEventListener('click', () => {
        params.onAnswerSelected(false);
      });
    }
  }

  getArtistQuestion(params) {
    this.quizTaskDescription.innerHTML = 'КТО АВТОР ДАННОЙ КАРТИНЫ?';
    this.picture = document.createElement('div');
    this.picture.classList.add('questions__image');
    this.picture.innerHTML = `<img src="assets/pictures/${params.currentQuestion}.jpg" alt="picture">`;
    this.questionsWrapper.append(this.picture);
    this.answerOptions = document.createElement('div');
    this.answerOptions.classList.add('questions__options');
    this.answerOptions.innerHTML = `<div class="questions__option correct">${
      quizInfo[params.currentQuestion].author
    }</div>
                                    <div class="questions__option incorrect">${
                                      quizInfo[this.getRandomInt(0, 240)].author
                                    }</div>
                                    <div class="questions__option incorrect">${
                                      quizInfo[this.getRandomInt(0, 240)].author
                                    }</div>
                                    <div class="questions__option incorrect">${
                                      quizInfo[this.getRandomInt(0, 240)].author
                                    }</div>`;
    this.questionsWrapper.append(this.answerOptions);
  }

  getPictureQuestion(params) {
    this.pictures = document.createElement('div');
    this.pictures.classList.add('pictures-questions__options');
    this.pictureAuthor = quizInfo[params.currentQuestion].author;
    this.quizTaskDescription.innerHTML = `КАКУЮ КАРТИНУ НАПИСАЛ ${this.pictureAuthor}?`;
    this.pictures.innerHTML = `<div class= "pictures-questions__option correct">
                                  <img src="assets/pictures/${
                                    params.currentQuestion
                                  }.jpg" alt='picture'>     
                              </div>
                              <div class= "pictures-questions__option incorrect">
                                  <img src="assets/pictures/${this.getRandomInt(
                                    0,
                                    240,
                                  )}.jpg" alt='picture'>     
                              </div>
                              <div class= "pictures-questions__option incorrect">
                                  <img src="assets/pictures/${this.getRandomInt(
                                    0,
                                    240,
                                  )}.jpg" alt='picture'>     
                              </div>
                              <div class= "pictures-questions__option incorrect">
                                  <img src="assets/pictures/${this.getRandomInt(
                                    0,
                                    240,
                                  )}.jpg" alt='picture'>     
                              </div>`;
    this.questionsWrapper.append(this.pictures);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
