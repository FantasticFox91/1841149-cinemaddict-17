import { remove, render, replace } from '../framework/render';
import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view';
import { isPressedEscapeKey } from '../utils/common';
import { UserAction, UpdateType } from '../const';
import FilmCommentsPresenter from './film-comments-presenter';

const Mode = {
  DEFAULT: 'DEFAULT',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #changeFilm = null;
  #filmComponent = null;
  #film = null;
  #filmsModel = null;
  #commentsModel = null;
  #filmPopup = null;
  #filmComments = null;
  #comments = [];
  #mode = Mode.DEFAULT;

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
    const siteFooterElement = document.querySelector('.footer');
    this.#filmPopup = new PopupView(film, this.#filmsModel, this.#changeFilm);
    this.#filmComments = new FilmCommentsPresenter(this.#filmPopup.element.querySelector('.film-details__inner'), this.#commentsModel.comments, this.#changeFilm);
    this.#filmComments.init(film);
    this.#filmPopup.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#filmPopup.setWatchedClickHandler(this.#onWatchedClick);
    this.#filmPopup.setFavouriteClickHandler(this.#onFavouriteClick);
    this.#filmPopup.setCloseButtonClickHandler(this.#onCloseButtonClick);
    document.body.classList.toggle('hide-overflow');
    render(this.#filmPopup, siteFooterElement, 'afterend');
    document.body.addEventListener('keydown', this.#onDocumentEscKeydown);
    this.#filmPopup.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseButtonClick);
  };

  #closePopUp = () => {
    document.body.classList.toggle('hide-overflow', false);
    document.body.removeEventListener('keydown', this.#onDocumentEscKeydown);
    this.#filmPopup.element.remove();
  };

  #onCloseButtonClick = () => {
    this.#closePopUp();
  };

  #onDocumentEscKeydown = (evt) => {
    if (isPressedEscapeKey(evt)) {
      evt.preventDefault();
      this.#closePopUp();
    }
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
}
