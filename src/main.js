import UserProfile from './view/user-profiile-view.js';
import MainNavigation from './view/main-navigation-view.js';
import FilterList from './view/filter-list-view.js';
import FooterStatistics from './view/footer-statistics-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import { render } from './render.js';


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');
const filmListPresenter = new FilmListPresenter;

render(new UserProfile(), siteHeaderElement);
render(new MainNavigation(), siteMainElement);
render(new FilterList(), siteMainElement);
filmListPresenter.init(siteMainElement);
render(new FooterStatistics(), siteFooterStatisticElement);
