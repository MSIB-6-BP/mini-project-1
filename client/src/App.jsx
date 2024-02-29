import { useEffect, useState } from "react";

import Card from "./components/Card";
import Chart from "./components/Chart";
import Interactor from "./components/Interactor";
import Sites from "./components/Sites";

import { handleConnect, handleDisconnect, handleStats } from "./helpers/Socket";
import { pushStat } from "./helpers/Analitycs";
import { buffWindowDefault, statBuffDefault } from "./helpers/Constants";

function App() {
  const [activeSite, setActiveSite] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [buffWindow, setBuffWindow] = useState(buffWindowDefault);
  const [statBuff, setStatBuff] = useState(statBuffDefault(15));

  const window = 15;
  const windowTime = 5000;

  useEffect(() => {
    const interval = setInterval(
      pushStat(setStatBuff, isOnline, buffWindow, setBuffWindow, window),
      windowTime
    );
    return () => clearInterval(interval);
  }, [buffWindow, statBuff, isOnline]);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", handleConnect(setIsOnline));
    socket.on("stats", handleStats(setBuffWindow));
    socket.on("disconnect", handleDisconnect(setIsOnline));
    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("stats");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [socket]);
  return (
    <main
      style={{
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0rem",
        }}
      >
        <p style={{ fontWeight: "bold", color: isOnline ? "green" : "red" }}>
          Status: {isOnline ? "online" : "offline"}
        </p>
        <p>
          Active:{" "}
          {activeSite ? `${activeSite.name} | ${activeSite.url}` : "none"}
        </p>
        <Interactor socket={socket} />
        <Sites
          socket={socket}
          setSocket={setSocket}
          setActiveSite={setActiveSite}
          setStatBuff={setStatBuff}
        />
      </div>
      <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
        <Card title="CO2">
          {statBuff[statBuff.length - 1].co2.toFixed(2)} ppm
        </Card>
        <Card title="Humidity">
          {statBuff[statBuff.length - 1].hum.toFixed(2)} g/m&sup3;
        </Card>
        <Card title="Solar Intensity">
          {statBuff[statBuff.length - 1].sol.toFixed(2)} W/m&sup2;
        </Card>
        <Card title="Temperature">
          {statBuff[statBuff.length - 1].temp.toFixed(2)} &deg;C
        </Card>
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
