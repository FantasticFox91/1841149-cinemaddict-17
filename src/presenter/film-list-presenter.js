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

  #filmsBoard = [];
  #comments = [];
  #topRatedFilms = [];
  #mostCommentedFilms = [];

  init = (filmListContainer, filmsModel) => {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#filmsBoard = [...this.#filmsModel.films];
    this.#comments = [...this.#filmsModel.comments];
    this.#topRatedFilms = this.#filmsBoard.slice();
    this.#mostCommentedFilms = this.#filmsBoard.slice();
    this.#topRatedFilms = this.#topRatedFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this.#mostCommentedFilms = this.#mostCommentedFilms.sort((a, b) => b.comments.length - a.comments.length);

    render(this.#filmSectionComponent, this.#filmListContainer);
    render(this.#filmListComponent, this.#filmSectionComponent.element);
    render(this.#filmBoard, this.#filmListComponent.element);
    for (let i = 0; i < this.#filmsBoard.length; i++) {
      this.#renderFilm(this.#filmsBoard[i]);
    }
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    render(this.#topRatedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#topRatedfilmBoard, this.#topRatedFilmsComponent.element);
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      this.#renderTopRatedFilm(this.#topRatedFilms[i]);
    }
    render(this.#mostCommendedFilmsComponent, this.#filmSectionComponent.element);
    render(this.#mostCommentedfilmBoard , this.#mostCommendedFilmsComponent.element);
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      this.#renderMostCommentedFilm(this.#mostCommentedFilms[i]);
    }
  };

  #renderFilm = (film) => {
    const filmCard  = new FilmCardView(film);
    filmCard.element.querySelector('.film-card__link').addEventListener('click', () => {
      if(!document.querySelector('.film-details')) {
        const object = this.#filmsBoard.find((film2) => film2.id === Number(filmCard.element.dataset.id));
        const selectedComments = this.#comments.filter(({id}) => object.comments.some((commentId) => commentId === Number(id)));
        showPopUp(object, selectedComments);
      }
    });
    render(filmCard, this.#filmBoard.element);
  };

  #renderTopRatedFilm = (film) => {
    const filmCard  = new FilmCardView(film);
    render(filmCard, this.#topRatedfilmBoard.element);
  };

  #renderMostCommentedFilm = (film) => {
    const filmCard  = new FilmCardView(film);
    render(filmCard, this.#mostCommentedfilmBoard.element);
  };
}
