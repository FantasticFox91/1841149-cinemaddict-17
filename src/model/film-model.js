import { generateFilm } from '../data/film.js';
import { generateComment } from '../data/comment.js';

export default class FilmsModel {
  comments = Array.from({length: 101}, generateComment);
  films = Array.from({length: 20}, generateFilm);

  getComments = () => this.comments;
  getFilms = () => this.films;
}
