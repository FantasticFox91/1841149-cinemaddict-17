import { UserAction, UpdateType } from '../const.js';
import { render, replace, remove } from '../framework/render.js';
import { isPressedEscapeKey } from '../utils/common.js';
import PopupView from '../view/popup-view';
import FilmCommentsPresenter from './film-comments-presenter.js';

export default class PopupPresenter {
  #film = null;
  #changeFilm = null;
  #popupContainer = null;
  #filmsModel = null;
  #filmComments = null;
  #commentsModel = null;
  #popupComponent = null;

  constructor(popupContainer, film, filmsModel, commentsModel, changeFilm) {
    this.#popupContainer = popupContainer;
    this.#commentsModel = commentsModel;
    this.#filmsModel = filmsModel;
    this.#film = film;
    this.#changeFilm = changeFilm;
  }

  init = (film) => {
    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(film, this.#filmsModel, this.#changeFilm);
    this.#filmComments = new FilmCommentsPresenter(this.#popupComponent.element, this.#commentsModel, this.#changeFilm);
    this.#filmComments.init(this.#film);
    this.#popupComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this.#onWatchedClick);
    this.#popupComponent.setFavouriteClickHandler(this.#onFavouriteClick);
    this.#popupComponent.setCloseButtonClickHandler(this.#onCloseButtonClick);
    document.body.addEventListener('keydown', this.#onDocumentEscKeydown);
    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#popupContainer);
      return;
    }

    replace(this.#popupComponent, prevPopupComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#popupComponent);
    document.body.removeEventListener('keydown', this.#onDocumentEscKeydown);
  };

  #onWatchlistClick = () => this.#handleCardControls('Watchlist', {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});

  #onWatchedClick = () => this.#handleCardControls('History', {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});

  #onFavouriteClick = () => this.#handleCardControls('Favorites', {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});

  #handleCardControls = (filter, updatedFilm) => {
    const currentFilter = document.querySelector('.main-navigation__item--active').dataset.filterType;
    this.#changeFilm(
      UserAction.UPDATE_FILM,
      (currentFilter === filter) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  };

  #onDocumentEscKeydown = (evt) => {
    if (isPressedEscapeKey(evt)) {
      evt.preventDefault();
      this.#closePopUp();
    }
  };

  #onCloseButtonClick = () => {
    this.#closePopUp();
  };

  #closePopUp = () => {
    document.body.classList.toggle('hide-overflow', false);
    document.body.removeEventListener('keydown', this.#onDocumentEscKeydown);
    this.destroy();
  };
}
