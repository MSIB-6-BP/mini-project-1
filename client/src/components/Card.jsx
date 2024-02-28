/* eslint-disable react/prop-types */
export default function Card({ title, children }) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
        width: "25%",
        backgroundColor: "#eee",
        padding: "1rem",
      }}
    >
      <h2 style={{ textAlign: "center", margin: 0 }}>{title}</h2>
      {children}
    </div>
  );
}
