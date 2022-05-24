import { generateFilm } from '../data/film';
import { generateComment } from '../data/comment';
import { MOCK_COMMENTS_AMMOUNT, MOCK_FILMS_AMOUNT } from '../const';

export default class FilmsModel {
  #comments = Array.from({length: MOCK_COMMENTS_AMMOUNT}, generateComment);
  #films = Array.from({length: MOCK_FILMS_AMOUNT}, generateFilm);

  get comments() {
    return this.#comments;
  }

  get films() {
    return this.#films;
  }
}
