import { render, remove, RenderPosition } from '../framework/render';
import FilmListView from '../view/film-list-view';
import FilmBoardView from '../view/film-board-view';
import FilmSectionView from '../view/film-section-view';
import TopRatedFilmsView from '../view/top-rated-films-view';
import MostCommendedFilmsView from '../view/most-commented-films-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import EmptyFilmsListView from '../view/empty-films-list-view';
import FilmPresenter from './film-presenter';
import { sortDateDown, sortRateDown } from '../utils/common';
import { EXTRA_CARDS_COUNT, FILMS_PER_STEP, SortType, UpdateType, UserAction, FilterType } from '../const';
import SortListView from '../view/sort-list-view';
import FilterPresenter from './filter-presenter';
import { Filter } from '../data/filters';
import LoadingView from '../view/loading-view';

export default class FilmListPresenter {
  #filmListContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #loadingComponent = new LoadingView;
  #filmSectionComponent = new FilmSectionView;
  #filmListComponent = new FilmListView;
  #filmBoard = new FilmBoardView;
  #topRatedfilmBoard = new FilmBoardView;
  #mostCommentedfilmBoard = new FilmBoardView;
  #emptyFilmList = null;
  #topRatedFilmsComponent = new TopRatedFilmsView;
  #mostCommendedFilmsComponent = new MostCommendedFilmsView;
  #sortComponent = null;
  #filterComponent = null;
  #showMoreButtonComponent = null;
  #topRatedFilms = [];
  #mostCommentedFilms = [];
  #filmPresenter = new Map();
  #topRatedPresnter = new Map();
  #mostCommentedPresenter = new Map();
  #renderFilmCount = FILMS_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(filmListContainer, filmsModel, commentsModel, filterModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#topRatedFilms = this.#filmsModel.films.slice();
    this.#topRatedFilms = this.#topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0,EXTRA_CARDS_COUNT);
    this.#mostCommentedFilms = this.#filmsModel.films.slice();
    this.#mostCommentedFilms = this.#mostCommentedFilms.sort((a, b) => b.comments.length - a.comments.length).slice(0,EXTRA_CARDS_COUNT);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #handleViewAction = (actionType, updateType, update, updatedComment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        this.#commentsModel.addComment(updateType, update, updatedComment);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        this.#commentsModel.deleteComment(updateType, update, updatedComment);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(data);
        }
        if (this.#topRatedPresnter.get(data.id)) {
          this.#topRatedPresnter.get(data.id).init(data);
        }
        if (this.#mostCommentedPresenter.get(data.id)) {
          this.#mostCommentedPresenter.get(data.id).init(data);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmsList();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderList();
        break;
    }
  };

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    let filteredFilms = films.slice();
    filteredFilms = Filter[this.#filterType](filteredFilms);

    switch(this.#currentSortType) {
      case SortType.DATE_DOWN:
        return filteredFilms.sort(sortDateDown);
      case SortType.RATE_DOWN:
        return filteredFilms.sort(sortRateDown);
    }
    return filteredFilms;
  }

  init = () => {
    this.#renderList();
  };

  #onShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderFilmCount + FILMS_PER_STEP);
    const films = this.films.slice(this.#renderFilmCount, newRenderedFilmCount);
    this.#renderFilms(films, this.#filmPresenter);
    this.#renderFilmCount = newRenderedFilmCount;

    if(this.#renderFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmSectionComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilms = (films, presenter) => films.forEach((film) => this.#renderFilm(film, this.#filmBoard.element, presenter));

  #renderFilm = (film, container, presenter) => {
    const filmPresenter = new FilmPresenter(container, this.#filmsModel, this.#commentsModel, this.#handleViewAction);
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
    remove(this.#filmListComponent);
    this.#renderFilmCount = FILMS_PER_STEP;
    remove(this.#showMoreButtonComponent);
    if(this.#emptyFilmList) {
      remove(this.#emptyFilmList);
    }
  };

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    if(this.#emptyFilmList) {
      remove(this.#emptyFilmList);
    }
    remove(this.#showMoreButtonComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    this.#topRatedPresnter.forEach((presenter) => presenter.destroy());
    this.#mostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filterComponent.destroy();
    if (resetRenderedFilmCount) {
      this.#renderFilmCount = FILMS_PER_STEP;
    } else {
      this.#renderFilmCount = Math.min(filmCount, this.#renderFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType){
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmList({resetRenderedFilmCount: true});
    this.#renderFilmsList();
  };

  #renderNoFilms = () => {
    this.#emptyFilmList = new EmptyFilmsListView(this.#filterType);
    render(this.#emptyFilmList, this.#filmSectionComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderMostCommentedFilms = () => {
    this.#mostCommentedFilms = this.#filmsModel.films.slice();
    this.#mostCommentedFilms = this.#mostCommentedFilms.sort((a, b) => b.comments.length - a.comments.length).slice(0,EXTRA_CARDS_COUNT);
    render(this.#mostCommendedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#mostCommentedfilmBoard , this.#mostCommendedFilmsComponent.element);
    this.#mostCommentedFilms.forEach((film) => this.#renderFilm(film, this.#mostCommentedfilmBoard.element, this.#mostCommentedPresenter));
  };

  #renderTopRatedFilms = () => {
    this.#topRatedFilms = this.#filmsModel.films.slice();
    this.#topRatedFilms = this.#topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0,EXTRA_CARDS_COUNT);
    render(this.#topRatedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#topRatedfilmBoard, this.#topRatedFilmsComponent.element);
    this.#topRatedFilms.forEach((film) => this.#renderFilm(film, this.#topRatedfilmBoard.element, this.#topRatedPresnter));
  };

  #renderFilmsList = () => {
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILMS_PER_STEP));
    if(filmCount === 0) {
      this.#renderNoFilms();
      return;
    }
    render(this.#filmListComponent, this.#filmSectionComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#filmBoard, this.#filmListComponent.element);
    this.#renderFilms(films, this.#filmPresenter);
    if (filmCount > FILMS_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
  };

  #renderSort = () => {
    this.#sortComponent = new SortListView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#filmListContainer);
  };

  #renderFilter= () => {
    this.#filterComponent = new FilterPresenter(document.querySelector('.main'), this.#filterModel, this.#filmsModel);
    this.#filterComponent.init();
  };

  #renderList = () => {
    this.#renderFilter();
    this.#renderSort();
    const films = this.films;
    const filmsCount = films.length;
    render(this.#filmSectionComponent, this.#filmListContainer);
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if(filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilmsList();
    this.#renderTopRatedFilms();
    this.#renderMostCommentedFilms();
  };
}
