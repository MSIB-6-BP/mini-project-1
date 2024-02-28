import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

import Chart from "./components/Chart";

function App() {
  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [statBuff, setStatBuff] = useState([]);

  const window = 15;

  useEffect(() => {
    setSocket(io("http://localhost:3000"));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      setIsOnline(true);
    });
    socket.on("message", (data) => {
      setMessage(data);
    });
    socket.on("stats-history", (data) => {
      setStatBuff(data);
    });
    socket.on("stats", (data) => {
      setStatBuff((prev) => [
        ...(prev.length >= window - 1
          ? prev.slice(prev.length - (window - 1))
          : prev),
        data,
      ]);
    });
    socket.on("disconnect", () => {
      setIsOnline(false);
    });
  }, [socket]);
  return (
    <main style={{ fontFamily: "sans-serif" }}>
      <p style={{ fontWeight: "bold", color: isOnline ? "green" : "red" }}>
        Status: {isOnline ? "online" : "offline"}
      </p>
      {statBuff.length > 0 && (
        <p>
          Date: {statBuff[0].time.split("T")[0]}
          {statBuff[statBuff.length - 1].time.split("T")[0] ===
          statBuff[0].time.split("T")[0]
            ? ""
            : ` - ${statBuff[statBuff.length - 1].time.split("T")[0]}`}
        </p>
      )}
      <p>{message}</p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p>
          CO2 Avg:{" "}
          {(
            statBuff.reduce((sum, stat) => {
              return sum + stat.co2;
            }, 0) / statBuff.length
          ).toFixed(2)}{" "}
          ppm
        </p>
        <p>
          Humidity Avg:{" "}
          {(
            statBuff.reduce((sum, stat) => {
              return sum + stat.hum;
            }, 0) / statBuff.length
          ).toFixed(2)}{" "}
          g/m3
        </p>
        <p>
          Solar Intensity Avg:{" "}
          {(
            statBuff.reduce((sum, stat) => {
              return sum + stat.sol;
            }, 0) / statBuff.length
          ).toFixed(2)}{" "}
          W/m2
        </p>
        <p>
          Temperature Avg:{" "}
          {(
            statBuff.reduce((sum, stat) => {
              return sum + stat.temp;
            }, 0) / statBuff.length
          ).toFixed(2)}{" "}
          C
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
        <Chart statBuff={statBuff} label="CO2" take="co2" />
        <Chart statBuff={statBuff} label="Humidity" take="hum" />
        <Chart statBuff={statBuff} label="Solar Intensity" take="sol" />
        <Chart statBuff={statBuff} label="Temperature" take="temp" />
      </div>
    </main>
  );
}

export default App;
