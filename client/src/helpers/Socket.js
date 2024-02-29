export const handleStats = (setBuffWindow) => (data) => {
  setBuffWindow((prev) => {
    prev.co2 = (prev.co2 + (data.co2 || 0)) / 2;
    prev.hum = (prev.hum + (data.hum || 0)) / 2;
    prev.sol = (prev.sol + (data.sol || 0)) / 2;
    prev.temp = (prev.temp + (data.temp || 0)) / 2;
    return prev;
  });
};

export const handleConnect = (setIsOnline) => () => {
  setIsOnline(true);
};

export const handleDisconnect = (setIsOnline) => () => {
  setIsOnline(false);
};
