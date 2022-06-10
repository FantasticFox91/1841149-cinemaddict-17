import FilmListPresenter from './presenter/film-list-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import FilmsApiService from './films-api-service';
import UserProfilePresenter from './presenter/user-profile-presenter';
import FooterPresenter from './presenter/footer-presenter';

const AUTHORIZATION = 'Basic kjnsfd67sdflj';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel;
const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, filmsModel);
const footerPresenter = new FooterPresenter(siteFooterStatisticElement, filmsModel);

filmsModel.init();
userProfilePresenter.init();
filmListPresenter.init();
footerPresenter.init();
