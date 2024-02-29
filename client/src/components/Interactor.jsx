/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function Interactor({ socket }) {
  const [inputMessage, setInputMessage] = useState("");
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      setLog((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <>
      <div>
        {log.map((message, index) => {
          return <p key={index}>{message.content}</p>;
        })}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (socket) {
            socket.emit("message", inputMessage);
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
    </>
  );
}
