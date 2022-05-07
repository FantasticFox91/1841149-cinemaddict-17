import AbstarctView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = () => '<p>130 291 movies inside</p>';

export default class FooterStatisticsView extends AbstarctView {
  get template() {
    return createFooterStatisticsTemplate();
  }
}
