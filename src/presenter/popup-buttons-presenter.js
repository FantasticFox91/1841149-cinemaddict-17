import PopupButtonsView from '../view/popup-buttons-view';
import { UpdateType, UserAction } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

export default class PopupButtonsPresenter {
  #filmsModel = null;
  #buttonsContainer = null;
  #buttonsComponent = null;
  #film = null;
  #changeFilm = null;

  constructor(buttonsContainer, film, filmsModel, changeFilm) {
    this.#film = film;
    this.#filmsModel = filmsModel;
    this.#buttonsContainer = buttonsContainer;
    this.#changeFilm = changeFilm;

    this.#filmsModel.addObserver(this.#handle);
  }

  init = (film) => {
    const prevButtonsComponent = this.#buttonsComponent;

    this.#buttonsComponent = new PopupButtonsView(film.userDetails);

    this.#buttonsComponent.setFavoriteClickHandler(() => this.#onFavoriteClick());
    this.#buttonsComponent.setWatchedClickHandler(() => this.#onWatchedClick());
    this.#buttonsComponent.setWatchlistClickHandler(() => this.#onWatchlistClick());

    if (prevButtonsComponent === null) {
      render(this.#buttonsComponent, this.#buttonsContainer);
      return;
    }

    if (this.#buttonsContainer.contains(prevButtonsComponent.element)) {
      replace(this.#buttonsComponent, prevButtonsComponent);
    }

    remove(prevButtonsComponent);
  };

  destroy = () => {
    remove(this.#buttonsComponent);
  };

  #onWatchlistClick = () => this.#handlePopupButtonsModelEvent(
    'Watchlist', {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});

  #onWatchedClick = () => this.#handlePopupButtonsModelEvent(
    'History', {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});

  #onFavoriteClick = () => this.#handlePopupButtonsModelEvent(
    'Favorites', {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});

  #handlePopupButtonsModelEvent = (filter, updatedFilm) => {
    const currentFilter = document.querySelector('.main-navigation__item--active').dataset.filterType;
    const updateType = (currentFilter === filter) ? UpdateType.MINOR : UpdateType.PATCH;
    this.#filmsModel.updateFilm(updateType, updatedFilm);
  };

  #handle = (updateType, updatedFilm) => {
    this.init(updatedFilm);
  };
}
