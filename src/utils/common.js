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
  const randomArray = [];
  for (let i = 0; i < number; i++) {
    randomArray.push(array[getRandomInteger(0, array.length - 1)]);
  }
  return randomArray;
};

const getRandomDecimalNumber = (max, min) => ((Math.random() * (max - min)) + min).toFixed(1);

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

export { getRandomInteger, generateRandomNameFromArray, getRandomDecimalNumber, calculateDuration, generateRandomArrayFromArray, isPressedEscapeKey, sortDateDown, sortRateDown };
