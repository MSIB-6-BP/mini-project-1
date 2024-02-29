/* eslint-disable react/prop-types */
export default function Card({ title, children }) {
  return (
    <div className="flex flex-col items-center justify-between gap-2 w-1/4 bg-gray-200 p-4">
      <h2 className="text-center font-semibold text-xl">{title}</h2>
      {children}
    </div>
  );
}
