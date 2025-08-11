import React, { useEffect, useRef, useState } from 'react';
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
  const chartRef = useRef();
  const [themeColors, setThemeColors] = useState({});

  // Function to get current theme colors safely
  const getThemeColors = () => {
    const isDark = document.body.classList.contains('dark');
    
    return {
      textColor: isDark ? '#ffffff' : '#2d1b69',
      gridColor: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(45, 27, 105, 0.2)',
      legendColor: isDark ? '#c4b5fd' : '#201b5eff',
      titleColor: isDark ? '#bb86fc' : '#4b1f97ff',
      isDark: isDark
    };
  };

  // Initialize theme colors
  useEffect(() => {
    setThemeColors(getThemeColors());
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newColors = getThemeColors();
      setThemeColors(newColors);
      
      if (chartRef.current) {
        const chart = chartRef.current;
        
        // Update chart options with new colors
        if (chart.options.plugins.legend.labels) {
          chart.options.plugins.legend.labels.color = newColors.legendColor;
        }
        if (chart.options.plugins.title) {
          chart.options.plugins.title.color = newColors.titleColor;
        }
        if (chart.options.scales.x.ticks) {
          chart.options.scales.x.ticks.color = newColors.textColor;
        }
        if (chart.options.scales.x.grid) {
          chart.options.scales.x.grid.color = newColors.gridColor;
        }
        if (chart.options.scales.y.ticks) {
          chart.options.scales.y.ticks.color = newColors.textColor;
        }
        if (chart.options.scales.y.grid) {
          chart.options.scales.y.grid.color = newColors.gridColor;
        }
        
        // Update the chart
        chart.update('none');
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const counts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(counts);
  const values = Object.values(counts);
  
  // Enhanced cosmic color palette
  const colors = [
    '#7c3aed', '#db2777', '#3b82f6', '#10b981',
    '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Mood Count',
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: colors.slice(0, labels.length).map(color => color + 'CC'),
        hoverBorderColor: colors.slice(0, labels.length),
        hoverBorderWidth: 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: themeColors.legendColor || '#201b5eff',
          font: {
            family: "'Inter', 'Segoe UI', sans-serif",
            size: 14,
            weight: '600'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Your Mood Overview',
        color: themeColors.titleColor || '#4b1f97ff',
        font: {
          family: "'Inter', 'Segoe UI', sans-serif",
          size: 18,
          weight: '700'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: themeColors.isDark 
          ? 'rgba(0, 0, 0, 0.9)' 
          : 'rgba(255, 255, 255, 0.95)',
        titleColor: themeColors.titleColor || '#4b1f97ff',
        bodyColor: themeColors.textColor || '#2d1b69',
        borderColor: themeColors.isDark ? '#8b5cf6' : '#7c3aed',
        borderWidth: 2,
        cornerRadius: 8,
        padding: 10
      }
    },
    scales: {
      x: {
        ticks: {
          color: themeColors.textColor || '#2d1b69',
          font: {
            family: "'Inter', 'Segoe UI', sans-serif",
            size: 12,
            weight: '500'
          }
        },
        grid: {
          color: themeColors.gridColor || 'rgba(45, 27, 105, 0.2)',
          drawBorder: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: themeColors.textColor || '#2d1b69',
          font: {
            family: "'Inter', 'Segoe UI', sans-serif",
            size: 12,
            weight: '500'
          },
          stepSize: 1,
          callback: function(value) {
            return Number.isInteger(value) ? value : '';
          }
        },
        grid: {
          color: themeColors.gridColor || 'rgba(45, 27, 105, 0.2)',
          drawBorder: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutCubic'
    },
    elements: {
      bar: {
        borderRadius: 8
      }
    }
  };

  return (
    <div className="mood-chart-container">
      <div style={{ 
        width: '100%', 
        height: '400px',
        position: 'relative'
      }}>
        <Bar 
          ref={chartRef}
          data={data} 
          options={options}
        />
      </div>
    </div>
  );
}