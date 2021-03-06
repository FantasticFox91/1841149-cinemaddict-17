import { render, remove, RenderPosition } from '../framework/render';
import FilmListView from '../view/film-list-view';
import FilmBoardView from '../view/film-board-view';
import FilmSectionView from '../view/film-section-view';
import TopRatedFilmsView from '../view/top-rated-films-view';
import MostCommendedFilmsView from '../view/most-commented-films-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import EmptyFilmsListView from '../view/empty-films-list-view';
import FooterView from '../view/footer-view';
import FilmPresenter from './film-presenter';
import { sortDateDown, sortRateDown, generateRandomFilms } from '../utils/common';
import { EXTRA_CARDS_COUNT, FILMS_PER_STEP, SortType, UpdateType, UserAction, FilterType, TimeLimit } from '../const';
import SortListView from '../view/sort-list-view';
import FilterPresenter from './filter-presenter';
import { FiltersList } from '../data/filters-list';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

export default class FilmListPresenter {
  #filmListContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #sortComponent = null;
  #filterComponent = null;
  #showMoreButtonComponent = null;
  #emptyFilmList = null;
  #isLoading = true;
  #topRatedFilms = [];
  #mostCommentedFilms = [];
  #filmPresenter = new Map();
  #topRatedPresnter = new Map();
  #mostCommentedPresenter = new Map();
  #renderFilmCount = FILMS_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #loadingComponent = new LoadingView;
  #filmSectionComponent = new FilmSectionView;
  #filmListComponent = new FilmListView;
  #filmBoard = new FilmBoardView;
  #topRatedfilmBoard = new FilmBoardView;
  #mostCommentedfilmBoard = new FilmBoardView;
  #topRatedFilmsComponent = new TopRatedFilmsView;
  #mostCommendedFilmsComponent = new MostCommendedFilmsView;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

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

  get films() {
    this.#filterType = this.#filterModel.filmListFilter;
    const films = this.#filmsModel.films;
    let filteredFilms = films.slice();
    filteredFilms = FiltersList[this.#filterType](filteredFilms);

    switch(this.#currentSortType) {
      case SortType.DATE_DOWN:
        return filteredFilms.sort(sortDateDown);
      case SortType.RATE_DOWN:
        return filteredFilms.sort(sortRateDown);
    }
    return filteredFilms;
  }

  init = () => this.#renderList();

  #handleViewAction = async (actionType, updateType, updatedFilm, updatedComment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#uiBlocker.block();
        try {
          await this.#filmsModel.updateFilm(updateType, updatedFilm);
        } catch (err) {
          this.#uiBlocker.unblock();
          this.#filmPresenter.get(updatedFilm.id).setAborting();
        }
        this.#uiBlocker.unblock();
        break;
      case UserAction.ADD_COMMENT:
        this.#uiBlocker.block();
        try {
          await this.#commentsModel.addComment(updateType, updatedFilm, updatedComment[0]);
        } catch (err) {
          this.#uiBlocker.unblock();
          this.#handleNewCommentError(updatedComment[1]);
        }
        this.#uiBlocker.unblock();
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#commentsModel.deleteComment(updateType, updatedFilm, updatedComment[0]);
        } catch (err) {
          this.#handleCommentError(updatedComment[1]);
        }
        break;
    }
  };

  #handleModelEvent = (updateType, film) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(film.id)) {
          this.#filmPresenter.get(film.id).init(film);
        }
        if (this.#topRatedPresnter.get(film.id)) {
          this.#topRatedPresnter.get(film.id).init(film);
        }
        if (this.#mostCommentedPresenter.get(film.id)) {
          this.#mostCommentedPresenter.get(film.id).init(film);
        }
        this.#filmsModel.updateLocalFilm(updateType, film);
        this.#renderMostCommentedFilms();
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
        this.#renderTopRatedFilms();
        this.#renderMostCommentedFilms();
        this.#renderFooterFilmStatistic();
        break;
    }
  };

  #handleCommentError = (commentContainer) => {
    const deleteCommentButton = commentContainer.querySelector('button');
    commentContainer.classList.add('shake');
    deleteCommentButton.textContent = 'Delete';
    deleteCommentButton.disabled = false;
    setTimeout(() => commentContainer.classList.remove('shake'), 500);
  };

  #handleNewCommentError = (commentContainer) => {
    commentContainer.classList.add('shake');
    commentContainer.querySelector('textarea').disabled = false;
    setTimeout(() => commentContainer.classList.remove('shake'), 500);
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

  #renderLoading = () => render(this.#loadingComponent, this.#filmSectionComponent.element, RenderPosition.AFTERBEGIN);

  #renderFilms = (films, presenter) => films.forEach((film) => this.#renderFilm(film, this.#filmBoard.element, presenter));

  #renderFilm = (film, container, presenter) => {
    const filmPresenter = new FilmPresenter(container, this.#filmsModel, this.#commentsModel, this.#handleViewAction);
    if(presenter === this.#filmPresenter) {
      this.#filmPresenter.set(film.id, filmPresenter);
    } else if (presenter === this.#topRatedPresnter) {
      this.#topRatedPresnter.set(film.id, filmPresenter);
    } else if (presenter === this.#mostCommentedPresenter) {
      this.#mostCommentedPresenter.set(film.id, filmPresenter);
    }
    filmPresenter.init(film, true);
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
    const filmsCount = this.films.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    if(this.#emptyFilmList) {
      remove(this.#emptyFilmList);
    }
    remove(this.#showMoreButtonComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    this.#filterComponent.destroy();
    if (resetRenderedFilmCount) {
      this.#renderFilmCount = FILMS_PER_STEP;
    } else {
      this.#renderFilmCount = Math.min(filmsCount, this.#renderFilmCount);
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
    this.#mostCommentedFilms = this.films.slice();
    const isEqual = this.#mostCommentedFilms
      .map((a) => a.comments.length)
      .filter((el) => el === this.#mostCommentedFilms[0].comments).length === this.#mostCommentedFilms.length;

    this.#mostCommentedFilms = isEqual ?
      generateRandomFilms(this.#mostCommentedFilms, 2) :
      this.#mostCommentedFilms
        .sort((a, b) => b.comments.length - a.comments.length)
        .slice(0,EXTRA_CARDS_COUNT);

    const isEmpty = this.#mostCommentedFilms.filter(({comments}) => comments.length === 0).length !== this.#mostCommentedFilms.length;

    if (isEmpty) {
      render(this.#mostCommendedFilmsComponent, this.#filmSectionComponent.element);
      render(this.#mostCommentedfilmBoard, this.#mostCommendedFilmsComponent.element);
      this.#mostCommentedPresenter.forEach((film) => film.destroy());
      this.#mostCommentedFilms.forEach((film) => this.#renderFilm(film, this.#mostCommentedfilmBoard.element, this.#mostCommentedPresenter));
    }
  };

  #renderTopRatedFilms = () => {
    this.#topRatedFilms = this.#filmsModel.films.slice();

    const isEqual = this.#topRatedFilms
      .map((a) => a.filmInfo.totalRating)
      .filter((el) => el === this.#topRatedFilms[0].filmInfo.totalRating).length === this.#topRatedFilms.length;

    this.#topRatedFilms = isEqual ?
      generateRandomFilms(this.#topRatedFilms, 2) :
      this.#topRatedFilms
        .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
        .slice(0,EXTRA_CARDS_COUNT);

    const isEmpty = this.#topRatedFilms.filter(({filmInfo}) => filmInfo.totalRating === 0).length !== this.#topRatedFilms.length;

    if (isEmpty) {
      render(this.#topRatedFilmsComponent, this.#filmSectionComponent.element);
      render(this.#topRatedfilmBoard, this.#topRatedFilmsComponent.element);
      this.#topRatedPresnter.forEach((film) => film.destroy());
      this.#topRatedFilms.forEach((film) => this.#renderFilm(film, this.#topRatedfilmBoard.element, this.#topRatedPresnter));
    }
  };

  #renderFooterFilmStatistic = () => render(new FooterView(this.films.length), document.querySelector('.footer__statistics'));

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
  };
}
