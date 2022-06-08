import AbstarctView from '../framework/view/abstract-view';

const createLoadingTemplate = () => '<section class="films-list"><h2 class="films-list__title">Loading...</h2></section>';

export default class LoadingView extends AbstarctView {
  get template() {
    return createLoadingTemplate();
  }
}
