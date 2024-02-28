import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

import Card from "./components/Card";
import Chart from "./components/Chart";

function App() {
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isOnline, setIsOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [buffWindow, setBuffWindow] = useState({
    co2: 0,
    hum: 0,
    sol: 0,
    temp: 0,
  });
  const [statBuff, setStatBuff] = useState(
    Array(15).fill({
      time: new Date().toISOString(),
      co2: 0,
      hum: 0,
      sol: 0,
      temp: 0,
    })
  );
  const [sites, setSites] = useState([]);

  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [activeSite, setActiveSite] = useState(null);

  const [inputMessage, setInputMessage] = useState("");

  const window = 15;
  const windowTime = 5000;

  useEffect(() => {
    const localSites = JSON.parse(localStorage.getItem("sites"));
    setSites(localSites || []);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
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
    }, windowTime);
    return () => clearInterval(interval);
  }, [buffWindow, statBuff, isOnline]);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      setIsOnline(true);
    });
    socket.on("message", (data) => {
      setMessage(data);
    });
    socket.on("stats", (data) => {
      setBuffWindow((prev) => {
        prev.co2 = (prev.co2 + (data.co2 || 0)) / 2;
        prev.hum = (prev.hum + (data.hum || 0)) / 2;
        prev.sol = (prev.sol + (data.sol || 0)) / 2;
        prev.temp = (prev.temp + (data.temp || 0)) / 2;
        return prev;
      });
    });
    socket.on("disconnect", () => {
      setIsOnline(false);
    });
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
        {activeSite && (
          <p>
            Active: {activeSite.name} | {activeSite.url}
          </p>
        )}
        {statBuff.length > 0 && (
          <p>
            Date: {statBuff[0].time.split("T")[0]}
            {statBuff[statBuff.length - 1].time.split("T")[0] ===
            statBuff[0].time.split("T")[0]
              ? ""
              : ` - ${statBuff[statBuff.length - 1].time.split("T")[0]}`}
          </p>
        )}
        <p>{message.content}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (socket) {
              socket.emit("message", "");
              setInputMessage("");
            }
          }}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSites((prev) => [...prev, { name: siteName, url: siteUrl }]);
            localStorage.setItem(
              "sites",
              JSON.stringify([...sites, { name: siteName, url: siteUrl }])
            );
            setSiteName("");
            setSiteUrl("");
          }}
        >
          <input
            type="text"
            value={siteName}
            onChange={(t) => setSiteName(t.target.value)}
          />
          <input
            type="text"
            value={siteUrl}
            onChange={(t) => setSiteUrl(t.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <div>
          {sites.map((site, i) => {
            return (
              <button
                key={i}
                onClick={() => {
                  if (socket) {
                    socket.disconnect();
                    setSocket(null);
                  }
                  setStatBuff(
                    Array(15).fill({
                      time: new Date().toISOString(),
                      co2: 0,
                      hum: 0,
                      sol: 0,
                      temp: 0,
                    })
                  );
                  setSocket(io(site.url));
                  setActiveSite(site);
                }}
              >
                {site.name}
              </button>
            );
          })}
        </div>
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
