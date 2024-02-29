/* eslint-disable react/prop-types */
export default function Indicator({ isOnline, activeSite }) {
  return (
    <div>
      <p style={{ fontWeight: "bold", color: isOnline ? "green" : "red" }}>
        Status: {isOnline ? "online" : "offline"}
      </p>
      <p>
        Active: {activeSite ? `${activeSite.name} | ${activeSite.url}` : "none"}
      </p>
    </div>
  );
}
