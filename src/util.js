import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
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

const humanizeTaskGetYear = (date) => dayjs(date).get('year');

const humanizeTaskGetDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');

const isActive = (option) => option;

const generateRandomDayFrom = (rangeType, min, max) => {
  const daysGap = getRandomInteger(max, min);

  return dayjs().add(daysGap, rangeType).toDate();
};

export {getRandomInteger,generateRandomNameFromArray, getRandomDecimalNumber, calculateDuration, humanizeTaskGetYear, isActive, generateRandomDayFrom, generateRandomArrayFromArray, humanizeTaskGetDate};
