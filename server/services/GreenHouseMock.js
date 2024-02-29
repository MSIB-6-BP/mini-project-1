var humidifier = false;
var humidityState = 0;

var shader = false;
var shaderState = 0;

var ac = 30;

function toggleHumidifier() {
  humidifier = !humidifier;
  return humidifier;
}

function humidifierStatus() {
  return humidifier;
}

function toggleShader() {
  shader = !shader;
  return shader;
}

function shaderStatus() {
  return shader;
}

function turnAC(temp) {
  ac = temp;
  return ac;
}

function getAC() {
  return ac;
}

function getHumidity() {
  if (humidifier) {
    humidityState += Math.random() * 10;
  } else {
    humidityState -= Math.random() * 10;
  }
  return clamp(
    humidityState + 100,
    Math.random() * 10,
    50 + Math.random() * 50,
  );
}

function getSolar() {
  if (!shader) {
    shaderState += Math.random() * 40;
  } else {
    shaderState -= Math.random() * 50;
  }
  return clamp(shaderState + 70, Math.random() * 10, 50 + Math.random() * 50);
}

function getTemperature() {
  return clamp(ac / 2 + (Math.random() * 50) / 2, Math.random() * 10, 100);
}

function getCO2() {
  return Math.random() * 100;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

module.exports = {
  getHumidity,
  toggleHumidifier,
  humidifierStatus,
  toggleShader,
  shaderStatus,
  getSolar,
  getAC,
  getTemperature,
  turnAC,
  getCO2,
};
