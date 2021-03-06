import { FilterType } from '../const';

const FiltersList = {
  [FilterType.ALL]: (films) => films,
  [FilterType.Watchlist]: (films) => films.filter(({userDetails}) => userDetails.watchlist),
  [FilterType.History]: (films) => films.filter(({userDetails}) => userDetails.alreadyWatched),
  [FilterType.Favorites]: (films) => films.filter(({userDetails}) => userDetails.favorite)
};

export { FiltersList };
