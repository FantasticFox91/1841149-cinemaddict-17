import { generateFilm } from '../data/film.js';
import { generateComment } from '../data/comment.js';

export default class FilmsModel {
  #comments = Array.from({length: 101}, generateComment);
  #films = Array.from({length: 30}, generateFilm);

  get comments() {
    return this.#comments;
  }

  get films() {
    return this.#films;
  }
}
