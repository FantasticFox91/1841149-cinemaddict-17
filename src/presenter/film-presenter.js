import { remove, render, replace } from '../framework/render';
import FilmCardView from '../view/film-card-view';
import { UserAction, UpdateType } from '../const';
import PopupPresenter from './popup-presenter';

const siteFooterElement = document.querySelector('.footer');

export default class FilmPresenter {
  #filmListContainer = null;
  #changeFilm = null;
  #filmComponent = null;
  #film = null;
  #filmsModel = null;
  #commentsModel = null;
  #filmPopup = null;

  constructor(filmListContainer, filmsModel, commentsModel, changeFilm) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#changeFilm = changeFilm;
    this.#commentsModel = commentsModel;
  }

  init(film) {
    this.#film = film;
    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmCardView(film);
    this.#filmPopup = new PopupPresenter(siteFooterElement, film, this.#commentsModel, this.#changeFilm);
    this.#filmComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#onWatchedClick);
    this.#filmComponent.setFavouriteClickHandler(this.#onFavouriteClick);
    this.#filmComponent.setClickHandler(() => this.#onCardClick(film));
    if (!prevFilmComponent) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }
    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }

  destroy = () => remove(this.#filmComponent);

  #onCardClick = (film) => {
    if(document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
      document.body.classList.toggle('hide-overflow');
    }
    this.#showPopUp(film);
  };

  #showPopUp = (film) => {
    this.#filmPopup = new PopupPresenter(siteFooterElement, film, this.#filmsModel, this.#commentsModel, this.#changeFilm);
    document.body.classList.toggle('hide-overflow');
    this.#filmPopup.init(film);
  };

  #onWatchlistClick = () => this.#handleCardControls(
    'Watchlist', {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});

  #onWatchedClick = () => this.#handleCardControls(
    'History', {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});

  #onFavouriteClick = () => this.#handleCardControls(
    'Favorites', {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});

  #handleCardControls = (filter, updatedFilm) => {
    const currentFilter = document.querySelector('.main-navigation__item--active').dataset.filterType;
    this.#changeFilm(
      UserAction.UPDATE_FILM,
      (currentFilter === filter) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  };

  updatedPopup(film, scroll) {
    this.#filmPopup.init(film, scroll);
  }
}
