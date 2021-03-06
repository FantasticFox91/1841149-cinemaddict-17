// Функция из интернета по генерации случайного числа из диапазона
import dayjs from 'dayjs';

// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRandomFilms = (films, amount) => {
  const randomFilms = [];
  while (randomFilms.length < amount) {
    const element = films[getRandomInteger(0, films.length - 1)];
    if (!randomFilms.find((el) => el.id === element.id)) {
      randomFilms.push(element);
    }
  }
  return randomFilms;
};

const calculateDuration = (minutes) => {
  const MINUTES_IN_HOUR = 60;
  const hours = minutes / MINUTES_IN_HOUR;
  if (hours < 1) {
    return `${minutes}m`;
  } else if ((minutes % MINUTES_IN_HOUR) === 0) {
    return `${hours.toFixed(0)}h`;
  }
  return `${hours.toFixed(0)}h ${minutes % MINUTES_IN_HOUR}m` ;
};

const isPressedEscapeKey = (evt) => evt.key === 'Escape';

const sortDateDown = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

const sortRateDown = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export { getRandomInteger, calculateDuration, generateRandomFilms, isPressedEscapeKey, sortDateDown, sortRateDown };
