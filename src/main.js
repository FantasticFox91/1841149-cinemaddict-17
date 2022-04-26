import NewUserProfile from './view/user-profiile.js';
import NewMainNavigation from './view/main-navigation.js';
import NewFilterList from './view/filter-list.js';
import NewFilmList from './view/film-list.js';
import NewFilmCard from './view/film-card.js';
import NewTopRatedFilms from './view/top-rated-films.js';
import NewMostCommendedFilms from './view/most-commented-films.js';
import NewShowMoreButton from './view/show-more-button.js';
import NewFooterStatistics from './view/footer-statistics.js';
import { render } from './render.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');

const CARDS_ON_START = 5;

render(new NewUserProfile(), siteHeaderElement);
render(new NewMainNavigation(), siteMainElement);
render(new NewFilterList(), siteMainElement);
render(new NewFilmList(), siteMainElement);
for (let i = 0; i < CARDS_ON_START; i++) {
  render(new NewFilmCard(), siteMainElement.querySelector('.films-list__container'));
}
render(new NewTopRatedFilms(), siteMainElement.querySelector('.films'));
render(new NewMostCommendedFilms(), siteMainElement.querySelector('.films'));
render(new NewShowMoreButton(), siteMainElement.querySelector('.films-list'));
render(new NewFooterStatistics(), siteFooterStatisticElement);
