import { navigate } from './navigation';

export class QuizCategoriesMenu {
  init(params) {
    this.answers = JSON.parse(localStorage.getItem('gamesResults'));
    this.createCategoryCards(params);
  }

  destroy() {
    this.quizCategoriesPage.remove();
  }

  createCategoryCards(params) {
    this.application = document.querySelector('.application');
    this.quizCategoriesPage = document.createElement('div');
    this.quizCategoriesPage.innerHTML = ` <section class="categories ${params.questionType}-categories">
                                            <div class="container">
                                              <header class="header">
                                                  <div class="header__logo"></div>
                                              </header>
                                              <button class="btn categories__btn home_button">Home</button>
                                              <div class="categories__wrapper ${params.questionType}-categories__wrapper"></div>
                                            </div>
                                          </section>`;
    this.application.append(this.quizCategoriesPage);
    this.categoriesWrapper = document.querySelector('.categories__wrapper');

    for (let cardNumber = 1; cardNumber <= 12; cardNumber++) {
      let pictureNumber = cardNumber === 1 ? 0 : 10 * cardNumber - 10;

      if (params.questionType === 'pictures') {
        pictureNumber += 9;
      }

      const categoryCard = document.createElement('div');
      categoryCard.classList.add('categories__item');
      const isGamePlayed = !!this.answers?.[`${cardNumber}${params.questionType}`];
      categoryCard.innerHTML = this.getCardTemplate(
        cardNumber,
        pictureNumber,
        this.getCorrectAnswersAmount(params, cardNumber) + '/10',
        true,
        isGamePlayed ? 'Score' : 'Play',
      );

      this.categoriesWrapper.append(categoryCard);
      const cardActionBtn = document.querySelector(`.action-btn-${cardNumber}`);

      if (isGamePlayed) {
        categoryCard.classList.add('active');
        cardActionBtn.addEventListener('click', () => {
          this.renderGameResultsCards(cardNumber, params);
        });
      } else {
        cardActionBtn.addEventListener('click', () => {
          navigate('quizQuestions', 'quizCategoriesMenu', {
            questionType: params.questionType,
            cardNumber: cardNumber,
          });
        });
      }
    }

    const homeButton = document.querySelector('.home_button');

    homeButton.addEventListener('click', () => {
      navigate('mainPage', 'quizCategoriesMenu');
    });
  }

  getCardTemplate(cardNumber, pictureNumber, score, withButton, buttonText) {
    let cardTemplate = `<div class="categories__info">
                  <div class="categories__name">${cardNumber}</div>
                  <div class="categories__score">${score}</div>                                      
            </div>                    
            <div class="categories__image categories__image${cardNumber}">                      
                  <img src="./assets/pictures/${pictureNumber}.jpg" alt="image">              
            </div>`;

    if (withButton) {
      cardTemplate += `<button class='btn categories__btn-score action-btn-${cardNumber}'>${buttonText}</button>`;
    }

    return cardTemplate;
  }

  renderGameResultsCards(cardNumber, params) {
    this.categoriesWrapper.innerHTML = '';

    for (let answerNumber = 1; answerNumber <= 10; answerNumber++) {
      const arrayAnswerNumber = answerNumber + (cardNumber - 1) * 10 - 1;
      const categoryCard = document.createElement('div');

      categoryCard.classList.add('categories__item');
      categoryCard.innerHTML = this.getCardTemplate(
        answerNumber,
        arrayAnswerNumber,
        this.getQuestionResult(answerNumber, cardNumber, params, arrayAnswerNumber, categoryCard),
        false,
      );
      
      this.categoriesWrapper.append(categoryCard);
    }
  }

  getCorrectAnswersAmount(params, cardNumber) {
    return this.answers?.[`${cardNumber}${params?.questionType}`]?.score ?? 0;
  }

  getQuestionResult(answerNumber, cardNumber, params, arrayAnswerNumber, categoryCard) {
    const cardResults = this.answers[`${cardNumber}${params.questionType}`];
    
    if (cardResults?.questionResults?.[arrayAnswerNumber]) {
      categoryCard.classList.add('active');
    }

    return !!cardResults?.questionResults?.[arrayAnswerNumber];
  }
}
