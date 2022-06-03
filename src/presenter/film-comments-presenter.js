import { remove, render, replace } from '../framework/render';
import FilmCommentsView from '../view/film-comments-view';

export default class FilmCommentsPresenter {
  #commentsContainer = null;
  #commentsComponent = null;
  #commentsModel = null;
  #changeFilm = null;

  constructor(commentsContainer, commentsModel, changeFilm) {
    this.#commentsContainer = commentsContainer;
    this.#commentsModel = commentsModel;
    this.#changeFilm = changeFilm;
  }

  destroy = () => {
    remove(this.#commentsComponent);
  };

  init(film) {
    const prevCommentsComponent = this.#commentsComponent;
    this.#commentsComponent = new FilmCommentsView(film, film.comments, this.#commentsModel.comments, this.#changeFilm);
    if (!prevCommentsComponent) {
      render(this.#commentsComponent, this.#commentsContainer);
      return;
    }
    if (this.#commentsContainer.contains(prevCommentsComponent.element)) {
      replace(this.#commentsComponent, prevCommentsComponent);
    }
    remove(prevCommentsComponent);
  }
}
