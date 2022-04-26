import UserProfile from './view/user-profiile.js';
import MainNavigation from './view/main-navigation.js';
import FilterList from './view/filter-list.js';
import FilmList from './view/film-list.js';
import FilmCard from './view/film-card.js';
import TopRatedFilms from './view/top-rated-films.js';
import MostCommendedFilms from './view/most-commented-films.js';
import ShowMoreButton from './view/show-more-button.js';
import FooterStatistics from './view/footer-statistics.js';
import { render } from './render.js';

const CARDS_ON_START = 5;
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');

render(new UserProfile(), siteHeaderElement);
render(new MainNavigation(), siteMainElement);
render(new FilterList(), siteMainElement);
render(new FilmList(), siteMainElement);
for (let i = 0; i < CARDS_ON_START; i++) {
  render(new FilmCard(), siteMainElement.querySelector('.films-list__container'));
}
render(new TopRatedFilms(), siteMainElement.querySelector('.films'));
render(new MostCommendedFilms(), siteMainElement.querySelector('.films'));
render(new ShowMoreButton(), siteMainElement.querySelector('.films-list'));
render(new FooterStatistics(), siteFooterStatisticElement);
