const {
  humidifierStatus,
  toggleHumidifier,
  toggleShader,
  shaderStatus,
  getAC,
  turnAC,
} = require("../services/GreenHouseMock");

module.exports = (ws) => (message) => {
  if (message === "toggle humidifier") {
    toggleHumidifier();
    ws.emit("message", {
      type: "info",
      content: `humidifier is now ${humidifierStatus() ? "on" : "off"}`,
    });
  }
  if (message === "toggle shader") {
    toggleShader();
    ws.emit("message", {
      type: "info",
      content: `shader is now ${shaderStatus() ? "closed" : "opened"}`,
    });
  }
  if (message.match(/set ac \d+/)) {
    const temp = message.match(/\d+/)[0];
    turnAC(temp);
    ws.emit("message", {
      type: "info",
      content: `ac is now set to ${getAC()}°C`,
    });
  }
  if (message === "get status") {
    ws.emit("message", {
      type: "info",
      content: `humidifier:${humidifierStatus() ? "on" : "off"}|shader:${
        shaderStatus() ? "closed" : "opened"
      }|ac:${getAC()}°C`,
    });
  }
};
