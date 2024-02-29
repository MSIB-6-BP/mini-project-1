/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function Interactor({ socket, className }) {
  const [inputMessage, setInputMessage] = useState("");
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      data.content = `Server>>${data.content}`;
      setLog((prev) => [data, ...prev]);
    });
  }, [socket]);

  return (
    <div className={`flex flex-col ${className}`}>
      <form
        className="w-full flex"
        onSubmit={(e) => {
          e.preventDefault();
          if (inputMessage === "clear") {
            setLog([]);
            setInputMessage("");
            return;
          }
          if (socket) {
            setLog((prev) => [
              { content: `You>>${inputMessage}`, type: "info" },
              ...prev,
            ]);
            socket.emit("message", inputMessage);
            setInputMessage("");
          }
        }}
      >
        <input
          className="flex-grow border px-2"
          type="text"
          placeholder="Query..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button className="px-4 py-1 bg-blue-500 text-white" type="submit">
          Send
        </button>
      </form>
      <div className="h-40 overflow-y-scroll border p-2">
        {log.map((message, index) => {
          return <p key={index}>{message.content}</p>;
        })}
      </div>
    </div>
  );
}
