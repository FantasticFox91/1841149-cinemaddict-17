// Функция из интернета по генерации случайного числа из диапазона

import dayjs from 'dayjs';

// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRandomNameFromArray = (array) => array[getRandomInteger(0, array.length - 1)];

const generateRandomArrayFromArray = (array, number) => {
  const a = [];
  for (let i = 0; i < number; i++) {
    a.push(array[getRandomInteger(0, array.length - 1)]);
  }
  return a;
};

const getRandomDecimalNumber = (max, min) => ((Math.random() * (max - min)) + min).toFixed(1);

const calculateDuration = (minutes) => {
  const hours = minutes / 60;
  if (hours < 1) {
    return `${minutes}m`;
  } else if ((minutes % 60) === 0) {
    return `${hours.toFixed(0)}h`;
  }
  return `${hours.toFixed(0)}h ${minutes % 60}m` ;
};

const isPressedEscapeKey = (evt) => evt.key === 'Escape';

const updateFilm = (films, update) => {
  const index = films.findIndex((film) => film.id === update.id);

  if(index === -1) {
    return films;
  }

  return [
    ...films.slice(0, index),
    update,
    ...films.slice(index + 1),
  ];
};

const SortType = {
  DDEFAULT: 'default',
  DATE_DOWN: 'date-down',
  RATE_DOWN: 'rate-down'
};

const sortDateDown = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

const sortRateDown = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export {getRandomInteger, generateRandomNameFromArray, getRandomDecimalNumber, calculateDuration, generateRandomArrayFromArray, isPressedEscapeKey, updateFilm, SortType, sortDateDown, sortRateDown};
