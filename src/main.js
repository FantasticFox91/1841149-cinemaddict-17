import { render } from './framework/render';
import UserProfile from './view/user-profile-view';
import FooterStatistics from './view/footer-statistics-view';
import FilmListPresenter from './presenter/film-list-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel;
const commentsModel = new CommentsModel;
const filterModel = new FilterModel;
const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);

render(new UserProfile, siteHeaderElement);
filmListPresenter.init();
render(new FooterStatistics, siteFooterStatisticElement);
