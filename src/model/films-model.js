import Observable from '../framework/observable';
import { generateFilm } from '../data/film';
import { MOCK_FILMS_AMOUNT } from '../const';

export default class FilmsModel extends Observable {
  #films = Array.from({length: MOCK_FILMS_AMOUNT}, generateFilm);

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);
    if(index === -1) {
      throw new Error('Can\'t update unexisting task');
    }
    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];
    this._notify(updateType, update);
  };
}
