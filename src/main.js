import { render } from './framework/render';
import UserProfile from './view/user-profile-view';
import FooterStatistics from './view/footer-statistics-view';
import FilmListPresenter from './presenter/film-list-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import FilmsApiService from './films-api-service';

const AUTHORIZATION = 'Basic kjnsfd67sdflj';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel;
const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);

filmsModel.init();
render(new UserProfile, siteHeaderElement);
filmListPresenter.init();
render(new FooterStatistics, siteFooterStatisticElement);
