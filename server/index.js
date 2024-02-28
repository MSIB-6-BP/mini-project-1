const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const {
  getHumidity,
  getSolar,
  getTemperature,
  getCO2,
} = require("./services/GreenHouseMock");
const Message = require("./events/Message");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const windowTime = 2500;

io.on("connection", (ws) => {
  ws.on("message", Message(ws));

  ws.emit("message", {
    type: "info",
    content: "Welcome to the server",
  });
});

setInterval(() => {
  io.emit("stats", {
    time: new Date(),
    co2: getCO2(),
    hum: getHumidity(),
    sol: getSolar(),
    temp: getTemperature(),
  });
}, windowTime);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
