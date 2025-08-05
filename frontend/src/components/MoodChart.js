// src/components/MoodChart.js
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// register the pieces you’re using
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MoodChart({ entries }) {
  const counts = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});
  const data = {
    labels: Object.keys(counts),
    datasets: [{ label: 'Count', data: Object.values(counts) }]
  };
  return <Bar data={data} />;
}
