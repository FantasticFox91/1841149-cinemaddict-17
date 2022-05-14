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
    this.#filmComponent.setWatchlistCickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setWatchedCickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavouriteCickHandler(this.#handleFavouriteClick);
    this.#filmComponent.setClickHandler(() => this.#onCardClick(film, this.#comments));
    if (prevFilmComponent === null) {
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
    this.#filmPopup.setWatchlistCickHandler(this.#handleWatchlistClick);
    this.#filmPopup.setWatchedCickHandler(this.#handleWatchedClick);
    this.#filmPopup.setFavouriteCickHandler(this.#handleFavouriteClick);
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

  #handleWatchlistClick = () => {
    this.#changeFilm({...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  };

  #handleWatchedClick = () => {
    this.#changeFilm({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
  };

  #handleFavouriteClick = () => {
    this.#changeFilm({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  };
}
