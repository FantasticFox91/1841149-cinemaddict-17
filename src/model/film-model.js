import { generateFilm } from '../fish/film';

export default class FilmsModel {
  films = Array.from({length: 20}, generateFilm);

  getFilms = () => this.films;
}
