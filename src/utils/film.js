import dayjs from 'dayjs';
import { getRandomInteger } from './common.js';

const humanizeFilmGetYear = (date) => dayjs(date).get('year');

const humanizeFilmGetDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');

const humanizeFilmGetPublishDate = (date) => dayjs(date).format('DD MMMM YYYY');

const generateRandomDayFrom = (rangeType, min, max) => {
  const daysGap = getRandomInteger(max, min);

  return dayjs().add(daysGap, rangeType).toDate();
};

export { humanizeFilmGetYear, generateRandomDayFrom, humanizeFilmGetDate, humanizeFilmGetPublishDate};
