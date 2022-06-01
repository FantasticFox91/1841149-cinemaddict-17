import { getRandomInteger, getRandomDecimalNumber, generateRandomNameFromArray, generateRandomArrayFromArray } from '../utils/common';
import { generateRandomDate } from '../utils/film';
import { TITLES, DIRECTORS, WRITERS, ACTORS, GENRES, COUNTRIES, POSTERS, DESCRIPTIONS, MAX_RATING, MAX_AGE_RATING, MAX_ARRAY_LENGTH, MIN, MAX_YEAR_GAP, MIN_RUNTIME, MAX_RUNTIME, DEFAULT_DATE_AND_TIME } from '../const';
import { nanoid } from 'nanoid';

export const generateFilm = () => ({
  id: nanoid(),
  comments: [...new Set(Array.from({length: getRandomInteger(1, 20)}, () => getRandomInteger(1, 90)))],
  filmInfo: {
    title: generateRandomNameFromArray(TITLES),
    alternativeTitle: generateRandomNameFromArray(TITLES),
    totalRating: Number(getRandomDecimalNumber(MAX_RATING, MIN)).toFixed(1),
    poster: `images/posters/${generateRandomNameFromArray(POSTERS)}.jpg`,
    ageRating: getRandomInteger(MIN, MAX_AGE_RATING),
    director: generateRandomArrayFromArray(DIRECTORS, MAX_ARRAY_LENGTH),
    writers: generateRandomArrayFromArray(WRITERS, MAX_ARRAY_LENGTH),
    actors: generateRandomArrayFromArray(ACTORS, MAX_ARRAY_LENGTH),
    release: {
      date: generateRandomDate('year', MAX_YEAR_GAP, MIN),
      releaseCountry: generateRandomNameFromArray(COUNTRIES),
    },
    runtime: getRandomInteger(MIN_RUNTIME, MAX_RUNTIME),
    genre: generateRandomArrayFromArray(GENRES, MAX_ARRAY_LENGTH),
    description: generateRandomNameFromArray(DESCRIPTIONS),
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: DEFAULT_DATE_AND_TIME,
    favorite: Boolean(getRandomInteger(0, 1))
  },
});
