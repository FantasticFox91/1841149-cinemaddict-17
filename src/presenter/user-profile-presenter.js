import { remove, render, replace } from '../framework/render';
import UserProfileView from '../view/user-profile-view';
import { FilterType } from '../const.js';
import { Filter } from '../data/filters.js';

export default class UserProfilePresenter {
  #userProfileContainer = null;
  #userProfileComponent = null;
  #filmsModel = null;

  constructor(userProfileContainer, filmsModel) {
    this.#userProfileContainer = userProfileContainer;
    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#handleFilmModelChange);
  }

  get films() {
    const films = this.#filmsModel.films;
    return Filter[FilterType.History](films).length;
  }

  init = () => {
    const wathedFilmsCount = this.films;
    const prevCommentsComponent = this.#userProfileComponent;
    this.#userProfileComponent = new UserProfileView(wathedFilmsCount);
    if (!prevCommentsComponent) {
      render(this.#userProfileComponent, this.#userProfileContainer);
      return;
    }
    if (this.#userProfileContainer.contains(prevCommentsComponent.element)) {
      replace(this.#userProfileComponent, prevCommentsComponent);
    }
    remove(prevCommentsComponent);
  };

  #handleFilmModelChange = () => this.init();
}
