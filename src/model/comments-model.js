import Observable from '../framework/observable';
import { generateComment } from '../data/comment';
import { MOCK_COMMENTS_AMMOUNT } from '../const';

export default class CommentsModel extends Observable {
  #comments = Array.from({length: MOCK_COMMENTS_AMMOUNT}, generateComment);

  get comments() {
    return this.#comments;
  }

  addСomment = (updateType, update, updatedComment) => {
    this.#comments = [
      updatedComment,
      ...this.#comments
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);
    if(index === -1) {
      throw new Error('Can\'t update unexisting task');
    }
    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
