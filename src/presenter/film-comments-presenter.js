import { remove, render, replace } from '../framework/render';
import FilmCommentsView from '../view/film-comments-view';

export default class FilmCommentsPresenter {
  #commentsContainer = null;
  #commentsComponent = null;
  #commentsModel = null;
  #changeFilm = null;
  #film = null;

  constructor(commentsContainer, film, commentsModel, changeFilm) {
    this.#commentsContainer = commentsContainer;
    this.#commentsModel = commentsModel;
    this.#changeFilm = changeFilm;
    this.#film = film;
    this.#commentsModel.addObserver(this.#handleCommentModelEvent);
  }

  init = async (film, updateType) => {
    const comments = updateType ? this.#commentsModel.comments : await this.#commentsModel.init(film).then(() => this.#commentsModel.comments);
    const prevCommentsComponent = this.#commentsComponent;
    this.#commentsComponent = new FilmCommentsView(film, comments, this.#handleCommentModelChange);
    if (!prevCommentsComponent) {
      render(this.#commentsComponent, this.#commentsContainer);
      return;
    }
    if (this.#commentsContainer.contains(prevCommentsComponent.element)) {
      replace(this.#commentsComponent, prevCommentsComponent);
    }
    remove(prevCommentsComponent);
  };

  destroy = () => {
    remove(this.#commentsComponent);
  };

  #handleCommentModelChange = (actionType, updateType, updatedFilm, UpdatedComment) => {
    this.#changeFilm(actionType, updateType, updatedFilm, UpdatedComment);
  };

  #handleCommentModelEvent = (updateType, updatedFilm) => {
    this.init(updatedFilm, updateType);
  };
}
