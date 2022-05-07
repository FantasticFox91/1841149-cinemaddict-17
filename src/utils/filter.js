import { FILTERS } from '../const';

const filter = {
  [FILTERS.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails.watchlist),
  [FILTERS.HISTORY]: (films) => films.filter(({userDetails}) => userDetails.alreadyWatched),
  [FILTERS.FAVORITES]: (films) => films.filter(({userDetails}) => userDetails.favorite)
};

export {filter};
