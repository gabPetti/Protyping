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
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import "./dashboard.sass"

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
);

export const dataLine = {
  labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
  datasets: [
    {
      label: false,
      data: [66, 57, 55, 59, 80, 65,76,73,79,83,79,75,71,68,67],
      fill: false,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    },
  ]
};

const optionsRadar = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  elements: {
    point: {
      pointRadius: 3,
      pointBackgroundColor: "rgba(255, 99, 132, 1)",
      pointBorderColor: "#181A1B",
      pointBorderWidth: 2,
    }
  },
  scales: {
    r: {
      ticks: {
        display: false
      },
      grid: {
        color: '#42484D'
      },
      pointLabels: {
        color: 'white'
      }
    }
  }
}

const optionsLine = {
  plugins: {
    legend: {
      display: false
    }
  },
  elements: {
    point: {
      pointRadius: 4,
      pointBackgroundColor: "rgba(75,192,192,1)",
      pointBorderColor: "#181A1B",
      pointBorderWidth: 2,
    },
    line: {
      tension: 0.3
    }
  },
  scales: {
    x: {
      grid: {
        color: "rgba(0,0,0,0)"
      }
    },
    y: {
      grid: {
        max: 100,
        color: "#42484D"
      }
    }
  }
}

export default function Dashboard({ wpm, accuracy, raw, consistency, burst }) {

  const dataRadar = {
    labels: ['WPM', 'Accuracy', 'Raw', 'Consistency', 'Burst'],
    datasets: [
      {
        label: false,
        data: [wpm, accuracy, raw, 61, 2],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        color: "white",
      },
    ],
  };

  return (
    <div className="dashboardContainer">
      <div className="dashboardWrapper">
        <div className="dashboardTop">
          <div className='stats'>
            <h2>{Math.round(wpm)}</h2>
            <h3>WPM</h3>
          </div>
          <div className='stats'>
            <h2>{Math.round(accuracy)}%</h2>
            <h3>Accuracy</h3>
          </div>
          <div className='stats'>
            <h2>{raw}</h2>
            <h3>Raw</h3>
          </div>
          <div className='stats'>
            <h2>{Math.round(consistency)}%</h2>
            <h3>Consistency</h3>
          </div>
          <div className='stats'>
            <h2>{burst}</h2>
            <h3>Burst</h3>
          </div>
        </div>
        <div className="dashboardBottom">
          <div className="dashboardRadar" style={{ color: "white"}}>
            <Radar options={optionsRadar} data={dataRadar} />
          </div>
          <div className="dashboardLine" style={{width: "max(70%, 200px)", color: "white"}}>
            <Line options={optionsLine} data={dataLine} />
          </div>
        </div>
      </div>
    </div>
  );
}
