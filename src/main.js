import { render } from './framework/render';
import UserProfile from './view/user-profiile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import FilterList from './view/filter-list-view.js';
import FooterStatistics from './view/footer-statistics-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilmsModel from './model/film-model.js';
import { generateFilter } from './data/filters';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel);
const filters = generateFilter(filmsModel.films);

render(new UserProfile(), siteHeaderElement);
render(new MainNavigationView(filters), siteMainElement);
render(new FilterList(), siteMainElement);
filmListPresenter.init();
render(new FooterStatistics(), siteFooterStatisticElement);
