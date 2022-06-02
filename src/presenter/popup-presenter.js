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

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init = (film) => {
    const prevFilterComponent = this.#popupComponent;

    this.#popupComponent = new PopupView(film, this.#filmsModel, this.#changeFilm);
    this.#filmComments = new FilmCommentsPresenter(this.#popupComponent.element, this.#commentsModel, this.#changeFilm);
    this.#filmComments.init(film);
    this.#popupComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this.#onWatchedClick);
    this.#popupComponent.setFavouriteClickHandler(this.#onFavouriteClick);
    this.#popupComponent.setCloseButtonClickHandler(this.#onCloseButtonClick);
    document.body.classList.toggle('hide-overflow');
    document.body.addEventListener('keydown', this.#onDocumentEscKeydown);

    if (prevFilterComponent === null) {
      render(this.#popupComponent, this.#popupContainer);
      return;
    }

    replace(this.#popupComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  destroy = () => remove(this.#popupComponent);

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.init(data);
        break;
    }
    document.body.classList.toggle('hide-overflow');
  };

  #onWatchlistClick = () => {
    this.#changeFilm(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}},
    );
  };

  #onWatchedClick = () => {
    this.#changeFilm(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}},
    );
  };

  #onFavouriteClick = () => {
    this.#changeFilm(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}},
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
