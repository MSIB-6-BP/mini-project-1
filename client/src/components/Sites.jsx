/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Sites({
  socket,
  setSocket,
  setActiveSite,
  setStatBuff,
}) {
  const [sites, setSites] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    const localSites = JSON.parse(localStorage.getItem("sites"));
    setSites(localSites || []);
  }, []);

  return (
    <>
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
    </>
  );
}
