import { MainPage } from './main-page';
import { QuizCategoriesMenu } from './quiz-categories-menu';
import { QuizQuestions } from './quiz-questions';
import { Settings } from './settings';

export const pages = {
  mainPage: new MainPage(),
  settings: new Settings(),
  quizCategoriesMenu: new QuizCategoriesMenu(),
  quizQuestions: new QuizQuestions(),
};

export function navigate(to, from = null, params = null) {
  if (from) {
    pages[from].destroy();
  }

  pages[to].init(params);
}
