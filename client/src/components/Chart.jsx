/* eslint-disable react/prop-types */
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
);

export default function Chart({ statBuff, label, take, max }) {
  return (
    <div className="flex w-1/2">
      <Line
        width={100}
        height={40}
        datasetIdKey="id"
        options={{
          scales: {
            y: {
              beginAtZero: true,
              max: max || 100,
            },
          },
        }}
        data={{
          labels: statBuff.map((stat) => stat.time.split("T")[1]),
          datasets: [
            {
              id: 1,
              label,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              data: statBuff.map((stat) => stat[take]),
            },
          ],
        }}
      />
    </div>
  );
}
