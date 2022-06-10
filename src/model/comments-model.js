import Observable from '../framework/observable';

export default class CommentsModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (film) => {
    try {
      const comments = await this.#filmsApiService.getComments(film);
      this.#comments = comments;
    } catch (err) {
      this.#comments = [];
    }
  };

  deleteComment = async (updateType, updateFilm, updatedComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === updatedComment.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }
    try {
      await this.#filmsApiService.deleteComment(updatedComment);
      this._notify(updateType, updateFilm);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  addComment = async (updateType, updateFilm, updatedComment) => {
    try {
      await this.#filmsApiService.addComment(updatedComment, updateFilm);
      this._notify(updateType, updateFilm);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };
}
