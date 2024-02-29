export const buffWindowDefault = {
  co2: 0,
  hum: 0,
  sol: 0,
  temp: 0,
};

export const statBuffDefault = (count) =>
  Array(count).fill({
    ...buffWindowDefault,
    time: new Date().toISOString(),
  });
