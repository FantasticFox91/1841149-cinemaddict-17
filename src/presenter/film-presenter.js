import {remove, render, replace} from '../framework/render';
import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view';
import { isPressedEscapeKey } from '../utils/common';

export default class FilmPresenter {
  #filmListContainer = null;
  #changeFilm = null;
  #filmComponent = null;
  #film = null;
  #filmsModel = null;
  #filmPopup = null;
  #comments = [];

  constructor(filmListContainer, filmsModel, changeFilm) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#changeFilm = changeFilm;
    this.#comments = [...this.#filmsModel.comments];
  }

  init(film, container) {
    this.#film = film;
    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmCardView(film);
    this.#filmComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#onWatchedClick);
    this.#filmComponent.setFavouriteClickHandler(this.#onFavouriteClick);
    this.#filmComponent.setClickHandler(() => this.#onCardClick(film, this.#comments));
    if (!prevFilmComponent) {
      render(this.#filmComponent, container);
      return;
    }
    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }

  destroy = () => remove(this.#filmComponent);

  #onCardClick = (film, commentsList) => {
    if(!document.querySelector('.film-details')) {
      const selectedComments = commentsList.filter(({id}) => film.comments.some((commentId) => commentId === Number(id)));
      this.#showPopUp(film, selectedComments);
    }
  };

  #showPopUp = (commentsData, film) => {
    const siteFooterElement = document.querySelector('.footer');
    this.#filmPopup = new PopupView(commentsData, film);
    this.#filmPopup.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#filmPopup.setWatchedClickHandler(this.#onWatchedClick);
    this.#filmPopup.setFavouriteClickHandler(this.#onFavouriteClick);
    document.body.classList.toggle('hide-overflow');
    render(this.#filmPopup, siteFooterElement, 'afterend');
    document.body.addEventListener('keydown', this.#onDocumentEscKeydown);
    this.#filmPopup.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseButtonClick);
  };

  #closePopUp = () => {
    document.body.classList.toggle('hide-overflow');
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
    this.#changeFilm({...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  };

  #onWatchedClick = () => {
    this.#changeFilm({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
  };

  #onFavouriteClick = () => {
    this.#changeFilm({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  };
}
