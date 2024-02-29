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
  } else if (message === "toggle shader") {
    toggleShader();
    ws.emit("message", {
      type: "info",
      content: `shader is now ${shaderStatus() ? "closed" : "opened"}`,
    });
  } else if (message.match(/set ac \d+/)) {
    const temp = message.match(/\d+/)[0];
    turnAC(temp);
    ws.emit("message", {
      type: "info",
      content: `ac is now set to ${getAC()}°C`,
    });
  } else if (message === "get status") {
    ws.emit("message", {
      type: "info",
      content: `humidifier:${humidifierStatus() ? "on" : "off"}|shader:${
        shaderStatus() ? "closed" : "opened"
      }|ac:${getAC()}°C`,
    });
  } else {
    ws.emit("message", {
      type: "warning",
      content: `unknown command: ${message}`,
    });
  }
};
