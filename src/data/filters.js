import { Filter } from '../utils/common';

const generateFilter = (films) => Object.entries(Filter).map(
  ([filterName, filterFilms]) => ({
    name: filterName,
    count: filterFilms(films).length,
  }),
);

export {generateFilter};
