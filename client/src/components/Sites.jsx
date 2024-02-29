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

  const pushSite = (e) => {
    e.preventDefault();
    if (!siteName || !siteUrl || sites.find((s) => s.name === siteName)) return;
    setSites((prev) => [...prev, { name: siteName, url: siteUrl }]);
    localStorage.setItem(
      "sites",
      JSON.stringify([...sites, { name: siteName, url: siteUrl }]),
    );
    setSiteName("");
    setSiteUrl("");
  };

  const deleteSite = (site) => {
    setSites((prev) => prev.filter((s) => s !== site));
    localStorage.setItem(
      "sites",
      JSON.stringify(sites.filter((s) => s !== site)),
    );
  };

  const changeSite = (site) => {
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
      }),
    );
    setSocket(io(site.url));
    setActiveSite(site);
  };

  useEffect(() => {
    const localSites = JSON.parse(localStorage.getItem("sites"));
    setSites(localSites || []);
  }, []);

  return (
    <div className="w-full flex flex-col gap-1">
      <form className="w-full flex" onSubmit={pushSite}>
        <input
          className="border px-2"
          type="text"
          placeholder="Site name..."
          value={siteName}
          onChange={(t) => setSiteName(t.target.value)}
        />
        <input
          className="border px-2 flex-grow"
          type="text"
          placeholder="Site url..."
          value={siteUrl}
          onChange={(t) => setSiteUrl(t.target.value)}
        />
        <button className="px-4 py-1 bg-blue-500 text-white" type="submit">
          Add
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {sites.map((site, i) => {
          return (
            <div key={i}>
              <button
                className="bg-slate-300 px-4 py-1 rounded-s-lg"
                onClick={() => changeSite(site)}
              >
                {site.name}
              </button>
              <button
                className="px-2 py-1 bg-slate-300 rounded-e-lg"
                onClick={() => deleteSite(site)}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
