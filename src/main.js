import FilmListPresenter from './presenter/film-list-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import FilmsApiService from './films-api-service';
import UserProfilePresenter from './presenter/user-profile-presenter';
import { AUTHORIZATION, END_POINT } from './const';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel;
const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, filmsModel);

filmsModel.init();
userProfilePresenter.init();
filmListPresenter.init();
