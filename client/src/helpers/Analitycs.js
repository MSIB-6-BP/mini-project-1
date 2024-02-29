export const pushStat =
  (setStatBuff, isOnline, buffWindow, setBuffWindow, window) => () => {
    setStatBuff((prev) => [
      ...(prev.length >= window - 1
        ? prev.slice(prev.length - (window - 1))
        : prev),
      isOnline
        ? { ...buffWindow, time: new Date().toISOString() }
        : { time: new Date().toISOString(), co2: 0, hum: 0, sol: 0, temp: 0 },
    ]);
    setBuffWindow({
      co2: 0,
      hum: 0,
      sol: 0,
      temp: 0,
    });
  };
