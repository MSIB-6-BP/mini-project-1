const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const windowTime = 2500;

app.use(cors());

io.on("connection", (ws) => {
  ws.on("message", (message) => {
    ws.emit("message", {
      type: "info",
      content: "Message received",
    });
  });

  ws.emit("message", {
    type: "info",
    content: "Welcome to the server",
  });
  ws.emit(
    "stats-history",
    Array(10)
      .fill(0)
      .map(() => ({
        time: new Date(),
        co2: ((Math.random() + Math.random()) / 2) * 100,
        hum: ((Math.random() + Math.random()) / 2) * 100,
        sol: ((Math.random() + Math.random()) / 2) * 100,
        temp: ((Math.random() + Math.random()) / 2) * 100,
      }))
  );
});

setInterval(() => {
  io.emit("stats", {
    time: new Date(),
    co2: ((Math.random() + Math.random()) / 2) * 100,
    hum: ((Math.random() + Math.random()) / 2) * 100,
    sol: ((Math.random() + Math.random()) / 2) * 100,
    temp: ((Math.random() + Math.random()) / 2) * 100,
  });
}, windowTime);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
