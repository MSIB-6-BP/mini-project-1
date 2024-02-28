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
      content: `Humidifier is now ${humidifierStatus() ? "on" : "off"}`,
    });
  }
  if (message === "toggle shader") {
    toggleShader();
    ws.emit("message", {
      type: "info",
      content: `Shader is now ${shaderStatus() ? "on" : "off"}`,
    });
  }
  if (message.match(/set ac \d+/)) {
    const temp = message.match(/\d+/)[0];
    turnAC(temp);
    ws.emit("message", {
      type: "info",
      content: `AC is now set to ${getAC()}°C`,
    });
  }
  if (message === "get status") {
    ws.emit("message", {
      type: "info",
      content: `Humidifier is ${
        humidifierStatus() ? "on" : "off"
      } | Shader is ${
        shaderStatus() ? "closed" : "opened"
      } | AC is set to ${getAC()}°C`,
    });
  }
};
