﻿export const addDays = (date: Date, days: number) => {
  return new Date(date.getTime() + 1000 * 60 * 60 * 24 * days);
};

export const clearTime = (date: Date) => {
  const result = new Date(date.getTime());
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getRandomNumber = (min: number, max: number) =>
  min + ~~(Math.random() * (max - min));

export const mod = (x, y) => ((x % y) + y) % y;
