import UserProfile from './view/user-profiile-view.js';
import MainNavigation from './view/main-navigation-view.js';
import FilterList from './view/filter-list-view.js';
import FooterStatistics from './view/footer-statistics-view.js';
import { render } from './render.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilmsModel from './model/film-model.js';
import PopupView from './view/popup-view.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');
const filmListPresenter = new FilmListPresenter();
const filmsModel = new FilmsModel();

render(new UserProfile(), siteHeaderElement);
render(new MainNavigation(), siteMainElement);
render(new FilterList(), siteMainElement);
filmListPresenter.init(siteMainElement, filmsModel);
render(new FooterStatistics(), siteFooterStatisticElement);
document.body.classList.add('hide-overflow');
render(new PopupView(), siteMainElement);
