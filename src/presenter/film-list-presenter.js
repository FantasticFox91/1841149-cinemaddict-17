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
  #topRatedPresnter = new Map();
  #mostCommentedPresenter = new Map();
  #renderFilmCount = FILMS_PER_STEP;

  constructor(filmListContainer, filmsModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#filmsList = [...this.#filmsModel.films];
    this.#topRatedFilms = this.#filmsList.slice();
    this.#mostCommentedFilms = this.#filmsList.slice();
    this.#topRatedFilms = this.#topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0,EXTRA_CARDS_COUNT);
    this.#mostCommentedFilms = this.#mostCommentedFilms.sort((a, b) => b.comments.length - a.comments.length).slice(0,EXTRA_CARDS_COUNT);
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

  #renderFilms = (from, to, presenter) => {
    this.#filmsList.slice(from, to).forEach((film) => this.#renderFilm(film, this.#filmBoard.element, presenter));
  };

  #renderFilm = (film, container, presenter) => {
    const filmPresenter = new FilmPresenter(container, this.#filmsModel, this.#handleFilmChange);
    filmPresenter.init(film, container);
    if(presenter === this.#filmPresenter) {
      this.#filmPresenter.set(film.id, filmPresenter);
    } else if (presenter === this.#topRatedPresnter) {
      this.#topRatedPresnter.set(film.id, filmPresenter);
    } else if (presenter === this.#mostCommentedPresenter) {
      this.#mostCommentedPresenter.set(film.id, filmPresenter);
    }
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderFilmCount = FILMS_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #handleFilmChange = (updatedFilm) => {
    this.#filmsList = updateFilm(this.#filmsList, updatedFilm);
    this.#topRatedFilms = updateFilm(this.#topRatedFilms, updatedFilm);
    this.#mostCommentedFilms = updateFilm(this.#mostCommentedFilms, updatedFilm);

    if (this.#filmPresenter.get(updatedFilm.id)) {
      this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }

    const topRatedPresnter = this.#topRatedPresnter.get(updatedFilm.id);
    if (topRatedPresnter) {
      topRatedPresnter.init(updatedFilm);
    }

    const mostCommentedPresenter = this.#mostCommentedPresenter.get(updatedFilm.id);
    if (mostCommentedPresenter) {
      mostCommentedPresenter.init(updatedFilm);
    }
  };

  #renderNoFilms = () => {
    render(this.#emptyFilmList, this.#filmListContainer);
  };

  #renderMostCommentedFilms = () => {
    render(this.#mostCommendedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#mostCommentedfilmBoard , this.#mostCommendedFilmsComponent.element);
    this.#mostCommentedFilms.forEach((film) => this.#renderFilm(film, this.#mostCommentedfilmBoard.element, this.#mostCommentedPresenter));
  };

  #renderTopRatedFilms = () => {
    render(this.#topRatedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#topRatedfilmBoard, this.#topRatedFilmsComponent.element);
    this.#topRatedFilms.forEach((film) => this.#renderFilm(film, this.#topRatedfilmBoard.element, this.#topRatedPresnter));
  };

  #renderFilmsList = () => {
    render(this.#filmListComponent, this.#filmSectionComponent.element);
    render(this.#filmBoard, this.#filmListComponent.element);
    this.#renderFilms(0, Math.min(this.#filmsList.length, FILMS_PER_STEP), this.#filmPresenter);
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
