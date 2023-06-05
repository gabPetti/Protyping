import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { useContext, useEffect } from "react";
import { TypetestContext } from "../../context/TypetestContext";
import "./dashboard.sass";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

const optionsRadar = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    point: {
      pointRadius: 4,
      pointBackgroundColor: "rgba(75,192,192,1)",
      pointBorderColor: "#181A1B",
      pointBorderWidth: 2,
    },
  },
  scales: {
    r: {
      ticks: {
        display: false,
      },
      grid: {
        color: "#42484D",
      },
      pointLabels: {
        color: "white",
      },
    },
  },
};

const optionsLine = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    point: {
      pointRadius: 4,
      pointBackgroundColor: "rgba(75,192,192,1)",
      pointBorderColor: "#181A1B",
      pointBorderWidth: 2,
    },
    line: {
      tension: 0.3,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(0,0,0,0)",
      },
    },
    y: {
      grid: {
        max: 100,
        color: "#42484D",
      },
    },
  },
};

export default function Dashboard({ wpm, wpmArray, accuracy, raw, consistency, burst }) {
  const { totalTime } = useContext(TypetestContext);

  const dataRadar = {
    labels: ["WPM", "Accuracy", "Raw", "Consistency", "Burst"],
    datasets: [
      {
        label: false,
        data: [wpm, accuracy, raw, 61, 2],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2.5,
        color: "white",
      },
    ],
  };

  const dataLine = {
    // labels from 1 to totalTime
    labels: [...Array(totalTime).keys()].map((x) => x + 1),
    datasets: [
      {
        label: false,
        data: wpmArray,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  useEffect(() => {
    dataLine.datasets[0].data = wpmArray;
  }, [wpmArray]);

  return (
    <div className="dashboardContainer">
      <div className="dashboardWrapper">
        <div className="dashboardTop">
          <div className="radarChart" style={{ color: "white" }}>
            <Radar options={optionsRadar} data={dataRadar} />
          </div>
          <div className="stats">
            <div className="stat">
              <h3>WPM</h3>
              <h2>{Math.round(wpm)}</h2>
            </div>
            <div className="stat">
              <h3>Accuracy</h3>
              <h2>{Math.round(accuracy)}%</h2>
            </div>
            <div className="stat">
              <h3>Raw</h3>
              <h2>{raw}</h2>
            </div>
            <div className="stat">
              <h3>Consistency</h3>
              <h2>{Math.round(consistency)}%</h2>
            </div>
            <div className="stat">
              <h3>Burst</h3>
              <h2>{burst}</h2>
            </div>
          </div>
        </div>
        <div className="dashboardBottom">
          <div
            className="lineChart"
            style={{ width: "100%", height: "200px", color: "white" }}
          >
            <Line options={optionsLine} data={dataLine} />
          </div>
        </div>
      </div>
    </div>
  );
}
