import {render, remove} from '../framework/render';
import FilmListView from '../view/film-list-view';
import FilmBoardView from '../view/film-board-view';
import FilmSectionView from '../view/film-section-view';
import TopRatedFilmsView from '../view/top-rated-films-view';
import MostCommendedFilmsView from '../view/most-commented-films-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import EmptyFilmListView from '../view/empty-films-view';
import FilmPresenter from './film-presenter';
import { updateFilm } from '../utils/common';

const EXTRA_CARDS_COUNT = 2;
const FILMS_PER_STEP = 5;

export default class FilmListPresenter {
  #filmListContainer = null;
  #filmsModel = null;

  #filmSectionComponent = new FilmSectionView;
  #filmListComponent = new FilmListView;
  #filmBoard = new FilmBoardView;
  #topRatedfilmBoard = new FilmBoardView;
  #mostCommentedfilmBoard = new FilmBoardView;
  #emptyFilmList = new EmptyFilmListView;
  #topRatedFilmsComponent = new TopRatedFilmsView;
  #mostCommendedFilmsComponent = new MostCommendedFilmsView;
  #showMoreButtonComponent = new ShowMoreButtonView;

  #filmsList = [];
  #topRatedFilms = [];
  #mostCommentedFilms = [];
  #filmPresenter = new Map();
  #renderFilmCount = FILMS_PER_STEP;

  constructor(filmListContainer, filmsModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#filmsList = [...this.#filmsModel.films];
    this.#topRatedFilms = this.#filmsList.slice();
    this.#mostCommentedFilms = this.#filmsList.slice();
    this.#topRatedFilms = this.#topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this.#mostCommentedFilms = this.#mostCommentedFilms.sort((a, b) => b.comments.length - a.comments.length);
  }

  init = () => {
    this.#filmsList = [...this.#filmsModel.films];
    this.#renderList();
  };

  #onShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderFilmCount, this.#renderFilmCount + FILMS_PER_STEP);
    this.#renderFilmCount += FILMS_PER_STEP;

    if(this.#renderFilmCount >= this.#filmsList.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderFilms = (from, to) => {
    this.#filmsList.slice(from, to).forEach((film) => this.#renderFilm(film, this.#filmBoard.element));
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(this.#filmBoard.element, this.#filmsModel, this.#handleFilmChange);
    filmPresenter.init(film, container);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderFilmCount = FILMS_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #handleFilmChange = (updatedFilm) => {
    this.#filmsList = updateFilm(this.#filmsList, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#filmListContainer);
  };

  #renderNoFilms = () => {
    render(this.#emptyFilmList, this.#filmListContainer);
  };

  #renderMostCommentedFilms = () => {
    render(this.#mostCommendedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#mostCommentedfilmBoard , this.#mostCommendedFilmsComponent.element);

    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      this.#renderFilm(this.#mostCommentedFilms[i], this.#mostCommentedfilmBoard.element);
    }
  };

  #renderTopRatedFilms = () => {
    render(this.#topRatedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#topRatedfilmBoard, this.#topRatedFilmsComponent.element);

    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      this.#renderFilm(this.#topRatedFilms[i], this.#topRatedfilmBoard.element);
    }
  };

  #renderFilmsList = () => {
    render(this.#filmListComponent, this.#filmSectionComponent.element);
    render(this.#filmBoard, this.#filmListComponent.element);
    this.#renderFilms(0, Math.min(this.#filmsList.length, FILMS_PER_STEP));
    if (this.#filmsList.length > FILMS_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
  };

  #renderList = () => {
    render(this.#filmSectionComponent, this.#filmListContainer);
    if(this.#filmsList.length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilmsList();
    this.#renderTopRatedFilms();
    this.#renderMostCommentedFilms();
  };
}
