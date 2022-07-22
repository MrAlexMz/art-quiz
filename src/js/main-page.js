import { navigate } from './navigation';

export class MainPage {
  init() {
    this.createMainPage();
  }

  destroy() {
    this.mainPage.remove();
  }

  createMainPage() {
    this.application = document.querySelector('.application');
    this.mainPage = document.createElement('div');
    this.mainPage.innerHTML = this.getMainPageTemplate();
    this.application.append(this.mainPage);

    const settingsBtn = document.querySelector('.settings-btn');
    const artistQuizCategoriesBtn = document.querySelector('.start__artists');
    const pictureQuizCategoriesBtn = document.querySelector('.start__pictures');
    
    settingsBtn.addEventListener('click', () => {
      navigate('settings', 'mainPage');
    });
    
    artistQuizCategoriesBtn.addEventListener('click', () => {
      navigate('quizCategoriesMenu', 'mainPage', { questionType: 'artists' });
    });
    
    pictureQuizCategoriesBtn.addEventListener('click', () => {
      navigate('quizCategoriesMenu', 'mainPage', { questionType: 'pictures' });
    });
  }

  getMainPageTemplate() {
    return `<section class="start">
      <div class="container">
          <header class="header">
              <div class="header__logo"></div>
          </header>
          <div class="start__wrapper">
              <div class="start__artists">
                  <img src="./assets/images/artists-quiz.jpg" alt="artists">
              </div>
              <div class="start__pictures">
                  <img src="./assets/images/pictures-quiz.jpg" alt="pictures">
              </div>
          </div>
          <button class="btn settings-btn">Settings</button>
      </div>
    </section>`;
  }
}
