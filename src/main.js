import { render } from './framework/render';
import UserProfile from './view/user-profile-view';
import MainNavigationView from './view/main-navigation-view';
import FooterStatistics from './view/footer-statistics-view';
import FilmListPresenter from './presenter/film-list-presenter';
import FilmsModel from './model/films-model';
import { generateFilter } from './data/filters';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel;
const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel);
const filters = generateFilter(filmsModel.films);

render(new UserProfile, siteHeaderElement);
render(new MainNavigationView(filters), siteMainElement);
filmListPresenter.init();
render(new FooterStatistics, siteFooterStatisticElement);
