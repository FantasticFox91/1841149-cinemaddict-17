import { render, remove, RenderPosition } from '../framework/render';
import FilmListView from '../view/film-list-view';
import FilmBoardView from '../view/film-board-view';
import FilmSectionView from '../view/film-section-view';
import TopRatedFilmsView from '../view/top-rated-films-view';
import MostCommendedFilmsView from '../view/most-commented-films-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import EmptyFilmsListView from '../view/empty-films-list-view';
import FilmPresenter from './film-presenter';
import FilterList from '../view/filter-list-view';
import { sortDateDown, sortRateDown } from '../utils/common';
import { EXTRA_CARDS_COUNT, FILMS_PER_STEP, SortType, UpdateType, UserAction } from '../const';
import FilterListView from '../view/filter-list-view';
import FilterPresenter from './filter-presenter';
import { Filter } from '../data/filters';

export default class FilmListPresenter {
  #filmListContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #filmSectionComponent = new FilmSectionView;
  #filmListComponent = new FilmListView;
  #filmBoard = new FilmBoardView;
  #topRatedfilmBoard = new FilmBoardView;
  #mostCommentedfilmBoard = new FilmBoardView;
  #emptyFilmList = new EmptyFilmsListView;
  #topRatedFilmsComponent = new TopRatedFilmsView;
  #mostCommendedFilmsComponent = new MostCommendedFilmsView;
  #filtersList = new FilterList;
  #filterComponent = null;
  #showMoreButtonComponent = null;
  #topRatedFilms = [];
  #mostCommentedFilms = [];
  #filmPresenter = new Map();
  #topRatedPresnter = new Map();
  #mostCommentedPresenter = new Map();
  #renderFilmCount = FILMS_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  constructor(filmListContainer, filmsModel, commentsModel, filterModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#topRatedFilms = this.#filmsModel.films.slice();
    this.#mostCommentedFilms = this.#filmsModel.films.slice();
    this.#topRatedFilms = this.#topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0,EXTRA_CARDS_COUNT);
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
        this.#commentsModel.addСomment(updateType, update, updatedComment);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, updatedComment);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderFilmsList();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsList();
        break;
    }
  };

  get films() {
    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    let filteredFilms = films.slice();
    filteredFilms = Filter[filterType](filteredFilms);

    switch(this.#currentSortType) {
      case SortType.DATE_DOWN:
        return filteredFilms.sort(sortDateDown);
      case SortType.RATE_DOWN:
        return filteredFilms.sort(sortRateDown);
    }
    return filteredFilms;
  }

  get comments() {
    return this.#commentsModel.comments;
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
    this.#renderFilmCount = FILMS_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    remove(this.#filterComponent);
    remove(this.#emptyFilmList);
    remove(this.#showMoreButtonComponent);

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
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILMS_PER_STEP));
    render(this.#filmListComponent, this.#filmSectionComponent.element, RenderPosition.BEFOREBEGIN);
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
    this.#filterComponent = new FilterListView(this.#currentSortType);
    this.#filtersList.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#filtersList, this.#filmListContainer, RenderPosition.AFTERBEGIN);
  };

  #renderList = () => {
    const films = this.films;
    const filmsCount = films.length;
    this.#filterComponent = new FilterPresenter(this.#filmSectionComponent.element, this.#filterModel, this.#filmsModel);

    render(this.#filmSectionComponent, this.#filmListContainer);
    this.#filterComponent.init();
    if(filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsList();
    this.#renderTopRatedFilms();
    this.#renderMostCommentedFilms();
  };
}
