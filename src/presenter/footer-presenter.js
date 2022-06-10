import { remove, render, replace } from '../framework/render';
import FooterView from '../view/footer-view';

export default class FooterPresenter {
  #footerContainer = null;
  #footerComponent = null;
  #filmsModel = null;

  constructor(footerContainer, filmsModel) {
    this.#footerContainer = footerContainer;
    this.#filmsModel = filmsModel;
  }

  init = async () => {
    const films = await this.#filmsModel.init().then(() => this.#filmsModel.films);
    const filmsCount = films.length;
    const prevCommentsComponent = this.#footerComponent;
    this.#footerComponent = new FooterView(filmsCount);
    if (!prevCommentsComponent) {
      render(this.#footerComponent, this.#footerContainer);
      return;
    }
    if (this.#footerContainer.contains(prevCommentsComponent.element)) {
      replace(this.#footerComponent, prevCommentsComponent);
    }
    remove(prevCommentsComponent);
  };
}
