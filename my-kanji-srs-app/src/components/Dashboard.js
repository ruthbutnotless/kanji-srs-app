import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function Dashboard({ reviewCards }) {
  const today = new Date();
  const buckets = Array(7).fill(0);
  reviewCards.forEach(c => {
    const diff = Math.floor((new Date(c.nextDue) - today) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 7) buckets[diff]++;
  });
  const max = Math.max(...buckets, 1);

  const srsIntervals = [0, 1, 3, 7, 14, 30];
  const chartData = {
    labels: srsIntervals.map(day => `Day ${day}`),
    datasets: [
      {
        label: 'SRS Review Stages',
        data: srsIntervals.map((_, index) => index + 1),
        borderColor: '#4caf50',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { type: 'category', title: { display: true, text: 'Time (Days)' } },
      y: { title: { display: true, text: 'Review Stage' } },
    },
  };

  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="dashboard">
      <h3>SRS Schedule (7-day) 📅</h3>
      <div className="bar-chart">
        {buckets.map((count, idx) => (
          <div key={idx} className="bar-container">
            <div className="bar" style={{ height: `${(count / max) * 100}%` }} />
            <span className="label">{idx === 0 ? 'Today' : `+${idx}d`}</span>
            <span className="count">{count}</span>
          </div>
        ))}
      </div>
      <h3>SRS Timeline 🕒</h3>
      <div className="srs-timeline">
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}