import dayjs from 'dayjs';
import { getRandomInteger } from './common.js';

const humanizeTaskGetYear = (date) => dayjs(date).get('year');

const humanizeTaskGetDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');

const humanizeTaskGetPublishDate = (date) => dayjs(date).format('DD MMMM YYYY');

const generateRandomDayFrom = (rangeType, min, max) => {
  const daysGap = getRandomInteger(max, min);

  return dayjs().add(daysGap, rangeType).toDate();
};

export { humanizeTaskGetYear, generateRandomDayFrom, humanizeTaskGetDate, humanizeTaskGetPublishDate};
