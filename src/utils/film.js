import dayjs from 'dayjs';
import { getRandomInteger } from './common';

const humanizeYear = (date) => dayjs(date).get('year');

const humanizeDate = (date) => dayjs(date).format('DD MMMM YYYY');

const humanizeDateAndTime = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

const generateRandomDate = (rangeType, min, max) => {
  const daysGap = getRandomInteger(max, min);

  return dayjs().add(daysGap, rangeType).toDate();
};

export { humanizeYear, generateRandomDate, humanizeDateAndTime, humanizeDate };
