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
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, updateFilm);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  addComment = async (updateType, updateFilm, updatedComment) => {
    try {
      const updatedFilm = await this.#filmsApiService.addComment(updatedComment, updateFilm).then((movie) => movie.movie);
      this._notify(updateType, this.#adaptToClient(updatedFilm));
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      filmInfo: {
        ...film.film_info,
        ageRating: film.film_info.age_rating,
        alternativeTitle: film.film_info.alternative_title,
        totalRating: film.film_info.total_rating,
        release: {
          date: film.film_info.release.date,
          releaseCountry: film.film_info.release.release_country
        }
      },
      userDetails: {...film.user_details,
        alreadyWatched: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date
      }
    };

    delete adaptedFilm.film_info;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.release.release_country;
    delete adaptedFilm.user_details;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;

    return adaptedFilm;
  };
}
