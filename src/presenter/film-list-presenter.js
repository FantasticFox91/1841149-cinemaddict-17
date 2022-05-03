import FilmListView from '../view/film-list-view';
import FilmBoardView from '../view/film-board-view';
import FilmSectionView from '../view/film-section-view';
import FilmCardView from '../view/film-card-view';
import TopRatedFilmsView from '../view/top-rated-films-view';
import MostCommendedFilmsView from '../view/most-commented-films-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import PopupView from '../view/popup-view.js';
import { render } from '../render';

const EXTRA_CARDS_COUNT = 2;
const siteFooterElement = document.querySelector('.footer');

const isPressedEscapeKey = (evt) => evt.key === 'Escape';

const onDocumentEscKeydown = (evt) => {
  if (isPressedEscapeKey(evt)) {
    evt.preventDefault();
    closePopUp();
  }
};

const showPopUp = (film, commentsData) => {
  document.body.classList.toggle('hide-overflow');
  render(new PopupView(film, commentsData),  siteFooterElement, 'afterend');
  document.body.addEventListener('keydown', onDocumentEscKeydown);
  document.querySelector('.film-details__close-btn').addEventListener('click', closePopUp);
};

function closePopUp () {
  document.body.classList.toggle('hide-overflow');
  document.body.removeEventListener('keydown', onDocumentEscKeydown);
  document.querySelector('.film-details').remove();
}

const onCardClick = (film, commentsList) => {
  if(!document.querySelector('.film-details')) {
    const selectedComments = commentsList.filter(({id}) => film.comments.some((commentId) => commentId === Number(id)));
    showPopUp(film, selectedComments);
  }
};

export default class FilmListPresenter {
  #filmListContainer = null;
  #filmsModel = null;

  #filmSectionComponent = new FilmSectionView;
  #filmListComponent = new FilmListView;
  #filmBoard = new FilmBoardView;
  #topRatedfilmBoard = new FilmBoardView;
  #mostCommentedfilmBoard = new FilmBoardView;
  #topRatedFilmsComponent = new TopRatedFilmsView;
  #mostCommendedFilmsComponent = new MostCommendedFilmsView;
  #showMoreButtonComponent = new ShowMoreButtonView;

  #filmsList = [];
  #comments = [];
  #topRatedFilms = [];
  #mostCommentedFilms = [];

  init = (filmListContainer, filmsModel) => {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#filmsList = [...this.#filmsModel.films];
    this.#comments = [...this.#filmsModel.comments];
    this.#topRatedFilms = this.#filmsList.slice();
    this.#mostCommentedFilms = this.#filmsList.slice();
    this.#topRatedFilms = this.#topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this.#mostCommentedFilms = this.#mostCommentedFilms.sort((a, b) => b.comments.length - a.comments.length);

    render(this.#filmSectionComponent, this.#filmListContainer);
    render(this.#filmListComponent, this.#filmSectionComponent.element);
    render(this.#filmBoard, this.#filmListComponent.element);
    for (let i = 0; i < this.#filmsList.length; i++) {
      this.#renderFilm(this.#filmsList[i], this.#filmBoard.element);
    }
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    render(this.#topRatedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#topRatedfilmBoard, this.#topRatedFilmsComponent.element);
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      this.#renderFilm(this.#topRatedFilms[i], this.#topRatedfilmBoard.element);
    }
    render(this.#mostCommendedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#mostCommentedfilmBoard , this.#mostCommendedFilmsComponent.element);
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      this.#renderFilm(this.#mostCommentedFilms[i], this.#mostCommentedfilmBoard.element);
    }
  };

  #renderFilm = (film, appendTo) => {
    const filmCard  = new FilmCardView(film);
    filmCard.element.querySelector('.film-card__link').addEventListener('click', () => onCardClick(film, this.#comments));
    render(filmCard, appendTo);
  };
}
