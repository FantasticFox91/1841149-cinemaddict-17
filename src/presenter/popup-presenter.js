import { UserAction, UpdateType } from '../const.js';
import { render, replace, remove } from '../framework/render.js';
import { isPressedEscapeKey } from '../utils/common.js';
import PopupView from '../view/popup-view';
import FilmCommentsPresenter from './film-comments-presenter.js';
import PopupButtonsPresenter from './popup-buttons-presenter.js';

export default class PopupPresenter {
  #film = null;
  #changeFilm = null;
  #popupContainer = null;
  #commentsModel = null;
  #filmsModel = null;
  #filmComments = null;
  #popupComponent = null;
  #popupButtons = null;

  constructor(popupContainer, film, filmsModel, commentsModel, changeFilm) {
    this.#popupContainer = popupContainer;
    this.#commentsModel = commentsModel;
    this.#film = film;
    this.#changeFilm = changeFilm;
    this.#filmsModel = filmsModel;
  }

  init = (film) => {
    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(film, this.#changeFilm);
    this.#popupButtons = new PopupButtonsPresenter(this.#popupComponent.element, film, this.#filmsModel, this.#changeFilm);
    this.#popupButtons.init(film);
    this.#filmComments = new FilmCommentsPresenter(this.#popupComponent.element, film, this.#commentsModel, this.#changeFilm);
    this.#filmComments.init(this.#film);
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
