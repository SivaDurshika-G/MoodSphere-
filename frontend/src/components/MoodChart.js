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
import '../assets/styles/moodchart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MoodChart({ entries }) {
  const counts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(counts);
  const values = Object.values(counts);
  const colors = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
    '#59a14f', '#edc948', '#b07aa1', '#ff9da7'
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Mood Count',
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderRadius: 5,
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
        }
      },
      title: {
        display: true,
        text: 'Your Mood Overview',
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
        font: { size: 18 }
      }
    },
    scales: {
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
        },
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--grid-color')
        }
      },
      y: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
        },
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--grid-color')
        }
      }
    }
  };

  return (
    <div className="mood-chart-container">
      <Bar data={data} options={options} />
    </div>
  );
}
